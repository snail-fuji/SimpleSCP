//TODO Refactor this all - do it in objects
const call = "call";
const waitReturn = "waitReturn";
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
  "sys_search",
  "print",
  "printNl",
  "printEl",
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
  return format(parseFunction(syntax["body"][0]).toString());
}

function format(string) {
  return string.split(' ').join('&nbsp;');
}

function parseFunction(syntax) {
  var parameters = [];
  for(var i = 0; i < syntax.params.length; i++) { 
    parameters.push(parseInParameter(i + 1, syntax.params[i]));
  }
  var operators = parseBlockStatement(syntax["body"], parameters);
  var operator = new Operator("return", [], new LinearTransition());
  if (operators.length > 0) {
    operators[operators.length - 1].transition = new LinearTransition(operator);
    operators.push(operator);
  }
  return new Program(parameters, operators);
}

function parseInParameter(number, parameter) {
  return new ArgumentDecorator(number, new ArgumentDecorator("fixed", new ArgumentDecorator("in", new VariableArgument(parameter["name"]))));
}

function parseOutParameter(number, parameter) {
  return new ArgumentDecorator(number, new ArgumentDecorator("out", new ArgumentDecorator("assign", new VariableArgument(parameter["name"]))));
}

function parseStatement(statement, parameterArray) {
  switch(statement["type"]) {
    case "ExpressionStatement":
      return parseExpressionStatement(statement["expression"]);
      break;
    case "BlockStatement":
      return parseBlockStatement(statement, parameterArray);
      break;
    case "IfStatement":
      return parseIfStatement(statement, parameterArray);
      break;
    case "ReturnStatement":
      var parameter = parseOutParameter(parameterArray.length + 1, statement["argument"]);
      parameterArray.push(parameter);
      break;
  }
}

function parseExpressionStatement(expression) {
  switch(expression.type) {
    case "CallExpression":
      return parseCallExpression(expression);
  }
}

function parseBlockStatement(block, parameters) {
  var temporaryOperators;
  var operators = [];
  var body = block["body"];
  for(var i = 0; i < body.length; i++)
  {
    temporaryOperators = parseStatement(body[i], parameters);
    if (temporaryOperators) {
      if (operators.length > 0) 
        operators[operators.length - 1].transition = new LinearTransition(temporaryOperators[0]);
      operators = operators.concat(temporaryOperators);
    }
  }
  return operators;
}

function parseIfStatement(condition, parameters) {
  //TODO add empty operator
  /*var test = parseExpressionStatement(condition["test"])[0];
  var consequent = parseStatement(condition["consequent"]);
  var alternate = [];
  if (condition["alternate"] != null) 
    alternate = parseStatement(condition["alternate"]);
  test.transition = new ConditionalTransition(consequent[0], alternate[0]);
  return [test].concat(consequent, alternate);*/
}

//TODO add switch block
function parseCallExpression(expression) {
  if (isSimpleLanguageOperator(expression["callee"]["name"])) {
    return parseSimpleLanguageOperator(expression);
  }
  else if (isSetLanguageOperator(expression["callee"]["name"])) {
    return parseSetLanguageOperator(expression);
  }
  else {
    return parseUserFunction(expression);
  }
}
//TODO Do parsing more simply. Be DRY.
function parseSimpleLanguageOperator(languageOperator) {
  //TODO Check linear transition
  var name = languageOperator["callee"]["name"];
  var arguments = parseArguments(languageOperator["arguments"]);
  var transition = new LinearTransition();
  return [new Operator(name, arguments, transition)];
}

function parseSetLanguageOperator(languageOperator) {
  //TODO Check linear transition
  var name = languageOperator["callee"]["name"];
  var arguments = parseSetArguments(languageOperator["arguments"]);
  var transition = new LinearTransition();
  return [new Operator(name, arguments, transition)];
}

function parseUserFunction(expression) {
  var name = new ArgumentDecorator(1, new ConstantArgument(expression["callee"]["name"]));
  var callArguments = new ArgumentDecorator(2, new ArgumentSet(parseArguments(expression["arguments"])));
  var process_assign = new ArgumentDecorator(3, new ArgumentDecorator("assign", new VariableArgument("process")));
  var process_fixed = new ArgumentDecorator(1, new ArgumentDecorator("fixed", new VariableArgument("process")));
  var arguments = [name, callArguments, process_assign];
  var waiter = new Operator(waitReturn, [process_fixed], new LinearTransition());
  var caller = new Operator(call, arguments, new LinearTransition(waiter));
  return [caller, waiter];
}

function parseArguments(argumentArray) {
  var arguments = [];
  for(var i = 0; i < argumentArray.length; i++) {
    var argument = argumentArray[i]["elements"];
    var temporaryArgument = parseArgument(argument);
    if (temporaryArgument) arguments.push(new ArgumentDecorator((i + 1), temporaryArgument));
  }
  return arguments;
}

function parseSetArguments(argumentArray) {
  var arguments = [];
  for(var i = 0; i < argumentArray.length; i++) {
    var argument = argumentArray[i]["elements"];
    var temporaryArgument = parseArgument(argument);
    if (temporaryArgument) { 
      if (i < argumentArray.length / 2)
        arguments.push(new ArgumentDecorator((i + 1), temporaryArgument));
      else 
        arguments.push(new ArgumentDecorator("set_"+(i + 1 - argumentArray.length / 2), temporaryArgument));
    }
  }
  return arguments;
}

//TODO preprocessing
function preprocessArgument(argument) {
  //if (argument.indexOf(fixed) == -1) argument.unshift(assign);
  //if (argument.indexOf(scp_const) == -1) argument.unshift(scp_var);
}

function parseArgument(argument) {
  //preprocessArgument(argument);
  if (argument.length != 0) {
    var element = argument[0]; 
    argument.splice(0, 1);
    if (isLiteral(element))
      return new ArgumentDecorator("fixed", new LiteralArgument(element["value"]));
    else if (isModifier(element["name"]))
      return new ArgumentDecorator(element["name"], parseArgument(argument));
    else if (isVariable(element["name"]))
      return new VariableArgument(element["name"]);
    else 
      return new ConstantArgument(element["name"]);
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

function isVariable(name) {
  return (name[0] == "_");
}

function isLiteral(element) {
  return (element.type == "Literal");
}