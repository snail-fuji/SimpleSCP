const languageOperatorsNames = [
  "search",
  "generate",
  "erase",
]
const languageOperators = {
  "search1":SearchElOperator,
  "search3":SearchElStr3Operator,
  "search5":SearchElStr5Operator,
  "search2":SearchSetOperator,
  "search6":SearchSetStr3Operator,
  "search10":SearchSetStr5Operator,
  "generate1":GenElOperator,
  "generate3":GenElStr3Operator,
  "generate5":GenElStr5Operator,
  "generate2":GenSetOperator,
  "generate6":GenSetStr3Operator,
  "generate10":GenSetStr5Operator,
  "erase1":EraseElOperator,
  "erase3":EraseElStr3Operator,
  "erase5":EraseElStr5Operator,
  "erase2":EraseSetOperator,
  "erase6":EraseSetStr3Operator,
  "erase10":EraseSetStr5Operator,
  //"has_value1":IfVarAssignOperator,
}
const modifiersNames = [
  "fixed",
  "assign",
  "pos_const_perm",
  "arc",
  "node",
  "erase",
  "variable",
  "constant",
  "common",
]
const modifiers = {
  "fixed":FixedArgument,
  "assign":AssignArgument,
  "pos_const_perm":PosConstPermArgument,
  "arc":ArcArgument,
  "node":NodeArgument,
  "erase":EraseArgument,
  "variable":ScpVarArgument,
  "constant":ScpConstArgument,
  "common":CommonArgument,
}
function parse(code) {
  syntax = esprima.parse(code);
  return format(design(parseFunction(syntax["body"][0]).toString()));
}

function format(string) {
  return string.split(' ').join('&nbsp;');
}

function design(string) {
  spaces = 0;
  index = string.search("<br>");
  designedString = "";
  while(index != -1) {
    line = string.substr(0, index + 4);
    string = string.substr(index + 4);
    if (line.search("\\*\\)") != -1) spaces -= 2;
    for(i = 0; i < spaces; i++)
      designedString += " ";
    designedString += line;
    if (line.search("\\(\\*") != -1) spaces += 2;
    index = string.search("<br>");
  }
  designedString += string;
  return designedString;
}

function parseFunction(syntax) {
  var parameters = [];
  /*for(var i = 0; i < syntax.params.length; i++) { 
    parameters.push(parseInParameter(i + 1, syntax.params[i]));
  }*/
  //searchParameters(syntax.body.body, parameters);
  var operators = parseBlockStatement(syntax["body"]);
  var returnOperator = new ReturnOperator();
  operators.setTransition(new LinearTransition(returnOperator));
  return new Program("lolkasa", parameters, [operators, returnOperator]);
}

function searchParameters(body, parameters) {
  for(var i = 0; i < body.length; i++) {
    if (body[i].type == "ReturnStatement")
      parameters.push(parseOutParameter(parameters.length + 1, body[i].argument));
    else break;
  }
}

function parseInParameter(number, parameter) {
  return new ArgumentDecorator(number, new ArgumentDecorator("in", new SimpleArgument(parameter["name"])));
}

function parseOutParameter(number, parameter) {
  return new ArgumentDecorator(number, new ArgumentDecorator("out", new SimpleArgument(parameter["name"])));
}

function parseStatement(statement) {
  switch(statement.type) {
    case "ExpressionStatement":
      return parseExpressionStatement(statement.expression);
    case "BlockStatement":
      return parseBlockStatement(statement);
    case "CallExpression":
      return parseCallExpression(statement);
  }
}

function parseExpressionStatement(expression) {
  switch(expression.type) {
    case "CallExpression":
      return parseCallExpression(expression);
  }
}

function parseBlockStatement(block) {
  var operators = [];
  var body = block["body"];
  for(var i = 0; i < body.length; i++) {
    var operator = parseStatement(body[i]);
    if (operator && operators.length != 0) operators[operators.length - 1].setTransition(new LinearTransition(operator));
    operators.push(operator);
  }
  return new BlockOperator(operators);
}

function parseCallExpression(expression) {
  if (isLanguageOperator(expression["callee"]["name"])) {
    return parseLanguageOperator(expression);
  }
  else {
    return parseUserFunction(expression);
  }
}

function parseLanguageOperator(languageOperator) {
  var name = languageOperator["callee"]["name"] + languageOperator["arguments"].length;
  var arguments = parseArguments(languageOperator["arguments"]);
  return new languageOperators[name](arguments);
}

function parseUserFunction(expression) {
  var name = processArgument(preprocessArgument([expression["callee"]["name"]]));
  var callArguments = parseArguments(expression["arguments"]);
  return new CallUserFunctionOperator(name, callArguments);
}

function parseArguments(argumentArray) {
  var arguments = [];
  for(var i = 0; i < argumentArray.length; i++) {
    var argument = argumentArray[i]["elements"];
    var temporaryArgument = parseArgument(argument);
    arguments.push(temporaryArgument);
  }
  return arguments;
}

function convertArgument(argument) {
  var preprocessedArgument = [];
  for(var i = 0; i < argument.length; i++) {
    if(argument[i].type == "Identifier")
      preprocessedArgument.push(argument[i]["name"]);
    else
      preprocessedArgument.push("[" + argument[i]["value"] + "]");
  }
  return preprocessedArgument;
}

function preprocessArgument(argument) {
  if (argument.length == 0) return [];
  var preprocessedArgument = argument;
  argumentName = preprocessedArgument[preprocessedArgument.length - 1];
  if (preprocessedArgument.indexOf("constant") == -1 && preprocessedArgument.indexOf("variable") == -1) {
    if (isVariable(argumentName)) {
      preprocessedArgument.unshift("variable");
      if (preprocessedArgument.indexOf("fixed") == -1 && preprocessedArgument.indexOf("assign") == -1)
        preprocessedArgument.unshift("fixed");
    }
    else {
      preprocessedArgument.unshift("constant");
      preprocessedArgument.unshift("fixed");
    }
  }
  return preprocessedArgument;
}

function processArgument(argument) {
  if (argument.length == 0) return undefined;
  var argumentObject;
  for(var i = argument.length - 1; i >=  0; i--) {
    var element = argument[i]; 
    if ((i != argument.length - 1) && isModifier(element)) 
      argumentObject = new modifiers[element](argumentObject);
    else 
      argumentObject = new SimpleArgument(element);
  }
  return argumentObject;
}

function parseArgument(argument) {
  return processArgument(preprocessArgument(convertArgument(argument)));
}

function isLanguageOperator(languageOperator) {
  return (languageOperatorsNames.indexOf(languageOperator) != -1)
}

function isModifier(modifier) {
  return (modifiersNames.indexOf(modifier) != -1) 
}

function isVariable(name) {
  return (name[0] == "_");
}

function isLiteral(name) {
  return (name[0] == "[");
}