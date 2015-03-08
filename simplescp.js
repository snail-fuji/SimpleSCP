  var operators_number = 0;
  
  var operators = {
    "search": "searchElStr3",
  };
  
  var modifiers = [
    "fixed",
    "assign", 
    
  ];
  
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
    return "-> ..operator" + increaseOperatorsNumber() + " (*<br><- " + parseCallee(syntax["callee"]) + ";;<br>" + parseArguments(syntax["arguments"]) + "*);;";
  } 
  
  function parseCallee(syntax) {
    return operators[syntax["name"]];;
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
        if (isModifier(element["name"])) 
          argument += "rrel_" + element["name"] + ": ";
        else {
          argument += element["name"] + ";;<br>";
          break;
        }
      }
    }
    return argument;
  }
  
  function isModifier(syntax) {
//TODO Move this shit out
    return modifiers.indexOf(syntax) != -1;
  }
