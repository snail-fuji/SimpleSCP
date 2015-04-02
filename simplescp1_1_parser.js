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
  "ifVarAssign",
  "contDivInt",
  "contDivIntRem",
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
  "scp_var",
  "scp_const",
]
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
  for(var i = 0; i < syntax.params.length; i++) { 
    parameters.push(parseInParameter(i + 1, syntax.params[i]));
  }
  var operators = parseBlockStatement(syntax["body"]);
  var operator = new Operator("return", [], new LinearTransition());
  if (operators.length > 0) {
    operators[operators.length - 1].transition = new LinearTransition(operator);
    operators.push(operator);
  }
  return new Program(parameters, operators);
}

function parseInParameter(number, parameter) {
  return new ArgumentDecorator(number, new ArgumentDecorator("scp_var", new ArgumentDecorator("fixed", new ArgumentDecorator("in", new VariableArgument(parameter["name"])))));
}

/*function parseOutParameter(number, parameter) {
  return new ArgumentDecorator(number, new ArgumentDecorator("out", new ArgumentDecorator("assign", new VariableArgument(parameter["name"]))));
}*/

function parseStatement(statement) {
  switch(statement["type"]) {
    case "ExpressionStatement":
      return parseExpressionStatement(statement["expression"]);
    case "BlockStatement":
      return parseBlockStatement(statement);
    case "IfStatement":
      return parseIfStatement(statement);
    /*case "ForInStatement":
      return parseForInStatement(statement);*/
    case "CallExpression":
      return parseCallExpression(statement);
    case "EmptyStatement":
      return [];
    case "WhileStatement":
      return parseWhileStatement(statement);
    //case "ReturnStatement":
    //  var parameter = parseOutParameter(parameterArray.length + 1, statement["argument"]);
    //  parameterArray.push(parameter);
    //  return [];
    //  break;
  }
}

function parseForInStatement(expression) {
  var iterator = parseArgument([expression["left"]]);
  var iterable_arc = new ArgumentDecorator("assign", new VariableArgument("_iterable_arc"))
  var iterable = parseArgument([expression["right"]]);
  var block = parseStatement(expression["body"], parameterArray);
  var empty = new Operator("print", [], new LinearTransition());
  var search = new Operator("searchElStr3", [iterable, iterable_arc, assign_iterator], new ConditionalTransition(block[0], empty));
  var erase = new Operator("eraseElStr3", [iterable, iterable_arc, fixed_iterator], new LinearTransition(search)); 
  return block;
}

function parseExpressionStatement(expression) {
  switch(expression.type) {
    case "CallExpression":
      return parseCallExpression(expression);
    case "ConditionalExpression":
      return parseIfStatement(expression);
  }
}

function parseBlockStatement(block) {
  var temporaryOperators;
  var operators = [];
  var body = block["body"];
  for(var i = 0; i < body.length; i++)
  {
    temporaryOperators = parseStatement(body[i]);
    if (temporaryOperators) {
      if (operators.length > 0) 
        operators[operators.length - 1].transition = new LinearTransition(temporaryOperators[0]);
      operators = operators.concat(temporaryOperators);
    }
  }
  return operators;
}

function parseIfStatement(condition) {
  var test = parseExpressionStatement(condition["test"])[0];
  var consequent = [];
  if (condition["consequent"] != null) 
    consequent = parseStatement(condition["consequent"]);
  var alternate = [];
  if (condition["alternate"] != null) 
    alternate = parseStatement(condition["alternate"]);
  var empty = new Operator("print", [new ArgumentDecorator("1", new ArgumentDecorator("fixed", new LiteralArgument("[...]")))], new LinearTransition());
  if (consequent.length != 0) 
    consequent[consequent.length - 1].transition = new LinearTransition(empty);
  else
  if (alternate.length != 0)
    alternate[alternate.length - 1].transition = new LinearTransition(empty);
  var thenOperator = consequent[0];
  var elseOperator = alternate[0];
  if(!thenOperator) thenOperator = empty;
  if(!elseOperator) elseOperator = empty;
  test.transition = new ConditionalTransition(thenOperator, elseOperator);
  var operatorArray = [test].concat(consequent, alternate);
  operatorArray.push(empty);
  return operatorArray;
}

function parseWhileStatement(loop) {
  var test = parseExpressionStatement(loop["test"])[0];
  var body = parseStatement(loop["body"]);
  var empty = new Operator("print", [new ArgumentDecorator("1", new ArgumentDecorator("fixed", new LiteralArgument("[...]")))], new LinearTransition());
  var nextOperator = body[0];
  var lastOperator = body[body.length - 1];
  if (!nextOperator) nextOperator = empty;
  if (!lastOperator) lastOperator = empty;
  test.transition = new ConditionalTransition(nextOperator, empty);
  lastOperator.transition = new LinearTransition(test);
  var operatorArray = [test].concat(body);
  operatorArray.push(empty);
  return operatorArray;
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
  var name = new ArgumentDecorator(1, new ArgumentDecorator("fixed", new ConstantArgument(expression["callee"]["name"])));
  var callArguments = new ArgumentDecorator(2, new ArgumentSet(parseArguments(expression["arguments"])));
  var process = new ArgumentDecorator("scp_var", new VariableArgument("_process"));
  var process_assign = new ArgumentDecorator(3, new ArgumentDecorator("assign", process));
  var process_fixed = new ArgumentDecorator(1, new ArgumentDecorator("fixed", process));
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

function processArgument(argument) {
  var argumentObject;
  for(var i = argument.length - 1; i >=  0; i--) {
    var element = argument[i]; 
    if (isLiteral(element))
      argumentObject = new ArgumentDecorator("fixed", new LiteralArgument(element));
    else if (isModifier(element)) 
      argumentObject = new ArgumentDecorator(element, argumentObject);
    else if (isVariable(element)) 
      argumentObject = new VariableArgument(element);
    else 
      argumentObject =new ConstantArgument(element);
  }
  return argumentObject;
}

function preprocessArgument(argument) {
  var preprocessedArgument = [];
  for(var i = 0; i < argument.length; i++) {
    if(argument[i].type == "Identifier")
      preprocessedArgument.push(argument[i]["name"]);
    else
      preprocessedArgument.push("[" + argument[i]["value"] + "]");
  }
  argumentName = preprocessedArgument[preprocessedArgument.length - 1];
  if (preprocessedArgument.indexOf("scp_const") == -1 && preprocessedArgument.indexOf("scp_var") == -1) {
    if (isVariable(argumentName)) {
      preprocessedArgument.unshift("scp_var");
      if (preprocessedArgument.indexOf("fixed") == -1 && preprocessedArgument.indexOf("assign") == -1)
        preprocessedArgument.unshift("assign");
    }
    else {
      preprocessedArgument.unshift("scp_const");
      preprocessedArgument.unshift("fixed");
    }
  }
  return preprocessedArgument;
}

function parseArgument(argument) {
  return processArgument(preprocessArgument(argument));
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

function isLiteral(name) {
  //return (element.type == "Literal");
  return (name[0] == "[");
}