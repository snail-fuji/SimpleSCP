//TODO Add defaults

function Program(parameters, operators) {
  this.parameters = parameters || [];
  this.operators = operators || [];
  for(var i = 0; i < this.operators.length; i++) 
    this.operators[i].id = i + 1;
  this.toString = function() {
  	return "scp_program -> " + this.getName() + " (*<br>" + this.getParameters() + this.getOperators() + "*);;";
  }
  this.getName = function() {
  	return "..program";
  }
  this.getOperators = function() {
  	var operatorString = "-> rrel_operators: ... (*<br>";
	  for(var i = 0; i < this.operators.length; i++) {
	    var operator = this.operators[i];
      operatorString += "-> ";
      if (i == 0) 
        operatorString += "rrel_init: ";
	    operatorString += operator.toString() + "<br>";
	  }
    operatorString += "*);;<br>";
	  return operatorString;
  }
  this.getParameters = function() {
    var parameterString = "-> rrel_params: ... (*<br>";
    for(var i = 0; i < this.parameters.length; i++) {
      var parameter = this.parameters[i];
      parameterString += "-> " + parameter.toString() + ";;<br>";
    }
    parameterString += "*);;<br>";
    return parameterString;  
  }
}

function Operator(type, arguments, transition) {
  this.id = Math.floor(Math.random()*65536);
  this.type = type
  this.arguments = arguments;
  this.transition = transition;
  this.toString = function() {
    return this.getName() + " (*<br>" + this.getType() + this.getArguments() + this.transition.toString() + "*);;";
  }
  this.getType = function() {
    return "<- " + this.type + ";;<br>";
  }
  this.getArguments = function() {
  	var argumentString = "";
	  for(var i = 0; i < this.arguments.length; i++) {
      var argument = this.arguments[i];
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

function ArgumentSet(arguments) {
  this.arguments = arguments;
  this.toString = function() {
    var body = "... (*<br>";
    for(var i = 0; i < this.arguments.length; i++) {
      var argument = this.arguments[i];
      body += "-> " + argument.toString() + ";;<br>";
    }
    body += "*)"
    return body;
  }
}

VariableArgument.prototype = Argument;
function VariableArgument(name) {
  this.identifier = name;
  this.toString = function() {
    return this.identifier;
  }
}

LiteralArgument.prototype = Argument;
function LiteralArgument(name) {
  this.identifier = name;
  this.toString = function() {
    return this.identifier;
  }
}

ConstantArgument.prototype = Argument;
function ConstantArgument(name) {
  this.identifier = name;
  this.toString = function() {
    return this.identifier;
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
    var body = "";
	  if (thenOperator) body += "=> nrel_then: " + this.thenOperator.getName() + ";;<br>";
	  if (elseOperator) body += "=> nrel_else: " + this.elseOperator.getName() + ";;<br>";
	  return body;
  }
}

function LinearTransition(nextOperator) {
  this.nextOperator = nextOperator;
  this.toString = function() {
    var body = "";
    if (nextOperator) body = "=> nrel_goto: " + this.nextOperator.getName() + ";;<br>";
    return body;
  }
}