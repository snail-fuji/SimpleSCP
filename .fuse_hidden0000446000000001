const languageOperators = [
  "search",
]
function parse(code) {
  syntax = esprima.parse(code);
  return parseProgram(syntax).toString();
}

function parseProgram(syntax) {
  operators = [];
  body = syntax["body"];
  for(i = 0; i < body.length; i++) {
    operator = parseOperator(body[i]);
    operators.push(operator);
  }
  return new Program(operators);
}


function parseOperator(operator) {
  switch(operator["type"]) {
    //case "BlockStatement":
      //return parseBlockStatement(operator);
      //break;
    //case "IfStatement": 
      //return parseIfStatement(operator);
      //break;
    case "ExpressionStatement":
      return parseExpressionStatement(operator["expression"]);
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
  var a = new Operator(name , arguments, transition);
  return a;
}

function parseArguments(argumentArray) {
  arguments = [];
  for(var i = 0; i < argumentArray.length; i++) {
    argument = argumentArray[i]["elements"];
    arguments.push(parseArgument(argument));
  }
  return arguments;
}

function parseArgument(argument) {
  if (argument.length != 0) {
    element = argument[0]; 
    argument.splice(0, 1);
    switch (element["name"]) {
      default:
        return new VariableArgument(element["name"]);
    }
  }
}

function isLanguageOperator(languageOperator) {
  return (languageOperators.indexOf(languageOperator) != -1)
}