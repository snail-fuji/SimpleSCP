  var operators_number = 0;
  
  function increaseOperatorsNumber() {
    return ++operators_number;
  }
  
  function parseProgram(syntax) {
    return "scp_program -> ..program (*<br>" + parseProgramBody(syntax["body"]) + "<br>*);;"; 
  }

  function parseProgramBody(syntax) {
    body = ""
    for(var i = 0; i < syntax.length; i++) {
      element = syntax[i]
      if (element["type"] == "ExpressionStatement")
        body += parseExpression(element["expression"]);
    }    
    body = "-> rrel_operators: ... (*<br>" + body + "<br>*);;"
    return body;
  }
 
  function parseExpression(syntax) {
    if (syntax["type"] == "CallExpression") 
      return parseCallExpression(syntax)
  }

  function parseCallExpression(syntax) {
//TODO Add name checking to another function
    return "-> ..operator" + increaseOperatorsNumber() + " (*<br><- " + syntax["callee"]["name"] + ";;<br>" + parseArguments(syntax["arguments"]) + "*);;";
  } 
  
  function parseArguments(syntax) {
    arguments = "";
    for (var i = 0; i < syntax.length; i++) {
      arguments += "-> rrel_" + (i + 1) + ": " + parseArgument(syntax[i]);
    }
    return arguments;
  }
  
  function parseArgument(syntax) {
    argument = "";
    var elements = syntax["elements"];
    for(var i = 0; i < elements.length; i++) {
      element = elements[i];
      if (element["type"] == "Identifier") {
        argument += "rrel_scp_var: "
//TODO Add this check to another function
        if (element["name"] == "fixed" || element["name"] == "assign") 
          argument += "rrel_" + element["name"] + ": ";
        else {
          argument += element["name"] + ";;<br>";
          break;
        }
      }
    }
    return argument;
  }
