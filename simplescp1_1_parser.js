const simpleLanguageOperators = [
  "searchElStr3",
  "searchEl",
  "searchElStr5",
  "genEl",
  "genElStr3",
  "genElStr5",
  "eraseEl",
  "eraseElStr3",
  "eraseElStr5",
]
const setLanguageOperators = [
  "searchSetStr3",
  "searchSet",
  "searchSetStr5",
  "genSet",
  "genSetStr3",
  "genSetStr5",
  "eraseSet",
  "eraseSetStr3",
  "eraseSetStr5",
]
const modifiers = [
  "fixed",
  "assign",
  "pos_const_perm",
  "arc",
  "node",
  "erase",
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
//TODO add switch block
function parseCallExpression(expression) {
  if (isSimpleLanguageOperator(expression["callee"]["name"])) {
    return parseSimpleLanguageOperator(expression);
  }
  else if (isSetLanguageOperator(expression["callee"]["name"])) {
    return parseSetLanguageOperator(expression);
  }
}
//TODO Do parsing more simply. Be DRY.
function parseSimpleLanguageOperator(languageOperator) {
  //TODO Check linear transition
  name = languageOperator["callee"]["name"];
  arguments = parseArguments(languageOperator["arguments"]);
  transition = new LinearTransition();
  return new Operator(name, arguments, transition);
}

function parseSetLanguageOperator(languageOperator) {
  //TODO Check linear transition
  name = languageOperator["callee"]["name"];
  arguments = parseSetArguments(languageOperator["arguments"]);
  transition = new LinearTransition();
  return new Operator(name, arguments, transition);
}

function parseArguments(argumentArray) {
  arguments = [];
  for(var i = 0; i < argumentArray.length; i++) {
    argument = argumentArray[i]["elements"];
    temporaryArgument = parseArgument(argument);
    if (temporaryArgument) arguments.push(new ArgumentDecorator((i + 1), temporaryArgument));
  }
  return arguments;
}

function parseSetArguments(argumentArray) {
  arguments = [];
  for(var i = 0; i < argumentArray.length; i++) {
    argument = argumentArray[i]["elements"];
    temporaryArgument = parseArgument(argument);
    if (temporaryArgument) { 
      if (i < argumentArray.length / 2)
        arguments.push(new ArgumentDecorator((i + 1), temporaryArgument));
      else 
        arguments.push(new ArgumentDecorator("set_"+(i + 1 - argumentArray.length / 2), temporaryArgument));
    }
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

function isSimpleLanguageOperator(languageOperator) {
  return (simpleLanguageOperators.indexOf(languageOperator) != -1)
}

function isSetLanguageOperator(languageOperator) {
  return (setLanguageOperators.indexOf(languageOperator) != -1)
}

function isModifier(modifier) {
  return (modifiers.indexOf(modifier) != -1) 
}