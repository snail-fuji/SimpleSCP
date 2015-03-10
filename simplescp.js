/*  var operators_number = 1;
  
  var operators = {
    "search": "searchEl",
    "searchAll": "searchSet",
    "gen": "genEl",
    "erase": "eraseEl",
    "eraseAll": "eraseSet",
    "call": "call",
  };
  
  var modifiers = [
    "fixed",
    "assign",     
  ];

  function increaseOperatorsNumber() {
    return ++operators_number;
  }
  function getOperatorsNumber() {
    return operators_number;
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
    else if (syntax["type"] == "Identifier")
      return parseMark(syntax)
  }

  function parseMark(syntax) {
  //TODO Add goto statement to mark operator
    return "-> .." + syntax["name"] + " (*<br>" + " <- print;; <br> " + "rrel_1: rrel_fixed: rrel_scp_const: [];;<br> *);;<br>";
  }

  function parseCallExpression(syntax) {
    //TODO get function level
    parseSCPCallExpression(syntax);
  } 
  
  function parseSCPCallExpression(syntax) {
    return "-> ..operator" + getOperatorsNumber() + " (*<br>" + parseOperatorHead(syntax["callee"]) + "<br>" + parseOperatorBody(syntax["asguments"]) + "<br>*);;";
  }

  function parseOperatorHead(syntax) {
    return "<- "+ operators[syntax["name"]] + ";;";
  }
  
  function parseOperatorBody(syntax) {
    body = syntax[0]["properties"];  
    parseArguments(body);
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
  
  function parseTransitions(syntax) {
        
  }

  function isModifier(syntax) {
//TODO Move this shit out
    return modifiers.indexOf(syntax) != -1;
  }

*/
const searchEl = "searchEl";
const searchElStr3 = "searchElStr3";
const searchElStr5 = "searchElStr5";
const genEl = "genEl";
const genElStr3 = "genElStr3";
const genElStr5 = "genElStr5";
const eraseEl = "eraseEl";
const eraseElStr3 = "eraseElStr3";
const eraseElStr5 = "eraseElStr5";
const fixed = "fixed";
const assign = "assign";
var modifiers = [
  fixed,
  assign,     
];
var operatorNumber = 1;
var program;

function search(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive) {
  if (arguments.length == 1)
    return search1(parameterOne);
  else if (arguments.length == 3)
    return search3(parameterOne, parameterTwo, parameterThree);
  else if (arguments.length == 5)
    return search5(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive);
}

function search1(parameter) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: searchEl,
      1: parameter,
      then: [],
      else: [],
    }
  );
}

function search3(parameterOne, parameterTwo, parameterThree) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: searchElStr3,
      1: parameterOne,
      2: parameterTwo,
      3: parameterThree,
      then: [],
      else: [],
    }
  );
}

function search5(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: searchElStr5, 
      1: parameterOne, 
      2: parameterTwo,
      3: parameterThree,
      4: parameterFour,
      5: parameterFive,
      then: [],
      else: [],
    }
  );
}

function gen(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive) {
  if (arguments.length == 1)
    return gen1(parameterOne);
  else if (arguments.length == 3)
    return gen3(parameterOne, parameterTwo, parameterThree);
  else if (arguments.length == 5)
    return gen5(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive);
}

function gen1(parameter) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: genEl,
      1: parameter,
      then: [],
      else: [],
    }
  );
}

function gen3(parameterOne, parameterTwo, parameterThree) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: genElStr3,
      1: parameterOne,
      2: parameterTwo,
      3: parameterThree,
      then: [],
      else: [],
    }
  );
}

function gen5(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: genElStr5, 
      1: parameterOne, 
      2: parameterTwo,
      3: parameterThree,
      4: parameterFour,
      5: parameterFive,
      then: [],
      else: [],
    }
  );
}

function erase(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive) {
  if (arguments.length == 1)
    return erase1(parameterOne);
  else if (arguments.length == 3)
    return erase3(parameterOne, parameterTwo, parameterThree);
  else if (arguments.length == 5)
    return erase5(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive);
}

function erase1(parameter) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: eraseEl,
      1: parameter,
      then: [],
      else: [],
    }
  );
}

function erase3(parameterOne, parameterTwo, parameterThree) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: eraseElStr3,
      1: parameterOne,
      2: parameterTwo,
      3: parameterThree,
      then: [],
      else: [],
    }
  );
}

function erase5(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: eraseElStr5, 
      1: parameterOne, 
      2: parameterTwo,
      3: parameterThree,
      4: parameterFour,
      5: parameterFive,
      then: [],
      else: [],
    }
  );
}

function scp(syntax) {	
  body = " <- " + syntax["name"] + " (*<br><- " + syntax["type"] + ";;<br>";
  for (var i = 1; i < 6; i++) {
    if (syntax[i] != undefined) {
      body += "<- rrel_" + i + ": " + parseArgument(syntax[i]);
    }
    set = ("set_" + i);
    if (syntax[set] != undefined) {

      body += "<- rrel_" + set + ": " + parseArgument(syntax[set]);
    }
  }
  if ("goto" in syntax) body += parseTransitions("nrel_goto", syntax["goto"]);
  if ("then" in syntax) body += parseTransitions("nrel_then", syntax["then"]);
  if ("else" in syntax) body += parseTransitions("nrel_else", syntax["else"]);
  body += "*);;<br>"
  return body;
}

function parseTransitions(nrel, syntax) {
  body = "";
  if (syntax.length == 0) {
    body = "=>" + nrel + ": " + getOperatorName(getOperatorNumber() + 1) + ";;<br>"
  }
  else {
    for(var i = 0; i < syntax.length; i++) {
      body += "=> " + nrel + ": " + syntax[i] + ";;<br>";
    }
  }
  return body;
}

function parseArgument(syntax) {
  argument = "";
  for(var i = 0; i < syntax.length; i++) {
    element = syntax[i];
    if (isModifier(element))
      argument += "rrel_" + element + ": ";
    else {
      argument += element + ";;<br>"
      break;
    }
  }
  return argument;
}

function isModifier(modifier) {
  return modifiers.indexOf(modifier) != -1;  
}

function getOperatorName(number) {
	return "..operator" + number;
}

function getOperatorNumber() {
	return operatorNumber;
}

function increaseOperatorNumber() {
	return ++operatorNumber;
}

function parse(syntax)
{
  return eval(syntax);
}


