function Program(operators) {
  this.operators = operators || [];
  this.toString = function() {
  	return "scp_program -> " + this.getName() + " (*<br>" + this.getOperators() + "*);;";
  }
  this.getName = function() {
  	return "..program";
  }
  this.getOperators = function() {
  	operatorString = "-> rrel_operators: ... (*<br>";
	  for(var i = 0; i < this.operators.length; i++) {
	    operator = operators[i];
	    operatorString += "-> " + operator.toString() + "<br>";
	  }
	  return operatorString;
  }
}
function Operator(type, arguments, transition) {
  Operator.maxId = ++Operator.maxId || 0;
  this.id = Operator.maxId;
  this.type = type
  this.arguments = arguments;
  this.transition = transition;
  this.toString = function() {
    return this.getName() + "(*<br>" + this.getType() +this.getArguments() + this.transition.toString() + "*);;";
  }
  this.getType = function() {
    return "<-  " + this.type + ";;<br>";
  }
  this.getArguments = function() {
  	argumentString = "";
	  for(var i = 0; i < this.arguments.length; i++) {
      argument = this.arguments[i];
	    argumentString += "-> " + argument.toString() + ";;<br>";
	  }
	  return argumentString;
  }
  this.getName = function() {
  	return "..operator" + this.id;
  }
}

function Argument(name) {
  this.identifier = name;
}

VariableArgument.prototype = Argument;
function VariableArgument(name) {
  this.identifier = name;
  this.toString = function() {
    return "rrel_scp_var: .._" + this.identifier;
  }
}

ConstantArgument.prototype = Argument;
function ConstantArgument(name) {
  this.identifier = name;
  this.toString = function() {
    return "rrel_scp_const: rrel_fixed: " + this.identifier;
  }
}

ArgumentDecorator.prototype = Argument;
function ArgumentDecorator(name, argument) {
  this.identifier = name;
  this.argument = argument;
  this.toString = function() {
    return "rrel_" + this.identifier + ": " + this.argument.toString();
  }
}

function ConditionalTransition(thenOperator, elseOperator) {
  this.thenOperator = thenOperator;
  this.elseOperator = elseOperator;
  this.toString = function() {
    body = "";
	  if (thenOperator) body += "=> nrel_then: " + this.thenOperator.getName() + ";;<br>";
	  if (elseOperator) body += "=> nrel_else: " + this.elseOperator.getName() + ";;<br>";
	  return body;
  }
}

function LinearTransition(nextOperator) {
  this.nextOperator = nextOperator;
  this.toString = function() {
    body = "";
    if (nextOperator) body = "=> nrel_goto: " + this.nextOperator.getName() + ";;<br>";
    return body;
  }
}


function test() {
  operators = [];
  operator = new Operator(
  	"searchElStr3",
  	[
  	  new VariableArgument("a"),
  	  new ArgumentDecorator("1", new ConstantArgument("b")), 
  	  new VariableArgument("c"),
  	],
  	new ConditionalTransition(null, null)
  	);
  operators.push(operator);
  program = new Program(operators);
  document.write(program.toString());
}
