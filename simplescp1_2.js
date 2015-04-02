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

function Operator() {
  this.id = Math.floor(Math.random()*65536);
}

function BasicOperator(type) {
  Operator.call(this);
  this.type = type;
  this.setTransition = function(transition) {
    this.transition = transition;
  }
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

function SimpleOperator(type, arguments) {
  BasicOperator.call(this, type);
  this.setArguments = function(arguments) {
    this.arguments = [];
    for(var i = 0; i < arguments.length; i++) {
      this.arguments.push(new NumberArgumentDecorator(i, arguments[i]));
    }
  }
  this.setArguments(arguments);
}

function SetOperator(type, arguments) {
  BasicOperator.call(this, type);
  this.setArguments = function(arguments) {
    this.arguments = [];
    for(var i = 0; i < arguments.length; i++) {
      var argument = arguments[i];
      if (i < arguments.length / 2)
        this.arguments.push(new NumberArgumentDecorator((i + 1), arguments));
      else 
        this.arguments.push(new NumberSetArgumentDecorator(i + 1 - argumentArray.length / 2, arguments));
  }
  this.setArguments(arguments); 
}

function ComplicatedOperator(operators) {
  Operator.call(this);
  this.operators = operators;
  this.toString = function() {
    var body = "";
    for(var i = 0; i < this.operators.length; i++) {
      var operator = this.operators[i];
      body += operator.toString() + "<br>";
    }
  }
}

function BlockOperator(operators) {
  ComplicatedOperator.call(this, operators);
  this.setTransition = function(transition) {
    this.operators[this.operators.length - 1].setTransition(transition);
  }
}

function IfOperator(testOperator, thenOperator, elseOperator) {
  ComplicatedOperator.call(this, [testOperator, thenOperator, elseOperator]);
  //TODO add transition to test operator
  this.operators[0].setTransition(new ConditionalTransition(thenOperator, elseOperator));
  this.setTransition = function(transition) {
    this.operators[1].setTransition(transition);
    this.operators[2].setTransition(transition);
  }
}

function WhileOperator(testOperator, loopOperator) {
  ComplicatedOperator.call(this, [testOperator, loopOperator]);
  this.operators[0].setTransition(new ConditionalTransition(loopOperator));
  this.setTransition = function(transition) {
    this.operators[1].setTransition(transition);
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

function SimpleArgument(name) {
  Argument.call(this, name);
  this.toString = function() {
    return this.identifier;
  }
}

function RandomArgument() {
  SimpleArgument.call(this, "argument" + Math.floor(Math.random()*65536));
}

function ArgumentDecorator(name, argument) {
  Argument.call(this, name);
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

function test() {
  alert(new SimpleOperator("lol", []));
}