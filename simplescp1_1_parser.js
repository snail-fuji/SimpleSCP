const languageOperators = [
  "searchElStr3",
  "searchEl",
  "searchElStr5",
]
const modifiers = [
  "fixed",
  "assign",
]
function parse(code) {
  syntax = esprima.parse(code);
  return parseFunction(syntax["body"][0]).toString();
}
/*
function parseProgram(syntax) {
  operators = [];
  body = syntax["body"];
  for(var i = 0; i < body.length; i++) {
    parseStatement(body[i], operators);
  }
  operator = new Operator("return", [], new LinearTransition());
  if (operators.length > 0) {
    operators[operators.length - 1].transition = new LinearTransition(operator);
    operators.push(operator);
  }

  return new Program(operators);
}
*/
function parseFunction(syntax) {
  parameters = [];
  for(var i = 0; i < syntax.params.length; i++) 
    parameters.push(new ArgumentDecorator((i + 1), parseParameter(syntax.params[i])));
  operators = [];
  body = syntax["body"]["body"];
  for(var i = 0; i < body.length; i++) {
    parseStatement(body[i], operators);
  }
  operator = new Operator("return", [], new LinearTransition());
  if (operators.length > 0) {
    operators[operators.length - 1].transition = new LinearTransition(operator);
    operators.push(operator);
  }
  return new Program(parameters, operators);
}

function parseParameter(parameter) {
  return new ArgumentDecorator("in", new ConstantArgument(parameter["name"]));
}

function parseStatement(statement, statementArray) {
  switch(statement["type"]) {
    case "ExpressionStatement":
      operator = parseExpressionStatement(statement["expression"]);
      if (statementArray.length > 0) 
        statementArray[statementArray.length - 1].transition = new LinearTransition(operator);
      statementArray.push(operator);
      break;
  }
}

function parseExpressionStatement(expression) {
  switch(expression.type) {
    case "CallExpression":
      return parseCallExpression(expression);
  }
}

function parseCallExpression(expression) {
  if (isLanguageOperator(expression["callee"]["name"])) {
    return parseLanguageOperator(expression);
  }
}

function parseLanguageOperator(languageOperator) {
  //TODO Check linear transition
  name = languageOperator["callee"]["name"];
  arguments = parseArguments(languageOperator["arguments"]);
  transition = new LinearTransition();
  return new Operator(name, arguments, transition);
}

function parseArguments(argumentArray) {
  arguments = [];
  for(var i = 0; i < argumentArray.length; i++) {
    argument = argumentArray[i]["elements"];
    arguments.push(new ArgumentDecorator((i + 1), parseArgument(argument)));
  }
  return arguments;
}

function parseArgument(argument) {
  if (argument.length != 0) {
    element = argument[0]; 
    argument.splice(0, 1);
    if (isModifier(element["name"])) {
      return new ArgumentDecorator(element["name"], parseArgument(argument));
    }
    return new VariableArgument(element["name"]);
  }
}

function isLanguageOperator(languageOperator) {
  return (languageOperators.indexOf(languageOperator) != -1)
}

function isModifier(modifier) {
  return (modifiers.indexOf(modifier) != -1) 
}