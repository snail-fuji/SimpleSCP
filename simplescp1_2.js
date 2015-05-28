/**
Represents a program
@constructor
@param {String} name - name of a program
@param {Array} parameters - array of program parameters
@param {Array} operators - array of operators
*/
function Program(name, parameters, operators) {
  this.name = name;
  this.parameters = parameters || [];
  this.operators = operators || [];
  //TODO Fix this anyway
  if (operators.length != 0) operators[0].setAdditionalInfo("rrel_init: ");
  //for(var i = 0; i < this.operators.length; i++) 
  //  this.operators[i].id = i + 1;
  this.toString = function() {
  	return "scp_program -> " + this.getName() + " (*<br>" + this.getParameters() + this.getOperators() + "*);;";
  }
  this.getName = function() {
  	return this.name;
  }
  this.getOperators = function() {
  	var operatorString = "-> rrel_operators: ... (*<br>";
	  for(var i = 0; i < this.operators.length; i++) {
	    var operator = this.operators[i];
	    operatorString += operator.toString();
	  }
    operatorString += "*);;<br>";
	  return operatorString;
  }
  this.getParameters = function() {
    if (parameters.length != 0) {
      var parameterString = "-> rrel_params: ... (*<br>";
      for(var i = 0; i < this.parameters.length; i++) {
        var parameter = this.parameters[i];
        parameterString += "-> " + parameter.toString() + ";;<br>";
      }
      parameterString += "*);;<br>";
      return parameterString;  
    }
    else return "";
  }
}

/**
  Abstract class for SimpleSCP-operator
  @constructor
*/
function Operator() {
  //TODO add autoincrement id
  this.id = Math.floor(Math.random()*65536);
}

/**
  Abstract class for basic SCP-operator
  @constructor
  @param {String} type - type of SCP-operator
*/
function BasicOperator(type) {
  Operator.call(this);
  this.type = type;
  this.arguments = [];
  this.transitions = [];
  this.additionalInfo = "";
  this.isEmpty = function() {
    return false;
  }
  this.addTransition = function(transition) {
    this.transitions.push(transition);
  }
  this.toString = function() {
    return "->" + this.getAdditionalInfo() + this.getName() + " (*<br>" + this.getType() + this.getArguments() + this.getTransitions() + "*);;<br>";
  }
  this.getType = function() {
    return "<- " + this.type + ";;<br>";
  }
  this.getArguments = function() {
    var argumentString = "";
    for(var i = 0; i < this.arguments.length; i++) {
      var argument = this.arguments[i];
      if (argument) argumentString += "-> " + argument.toString() + ";;<br>";
    }
    return argumentString;
  }
  this.getTransitions = function() {
    var transitionString = "";
    for(var i = 0; i < this.transitions.length; i++) {
      var transition = this.transitions[i];
      transitionString += transition.toString();
    }
    return transitionString;
  }
  this.getName = function() {
    return "..operator" + this.id;
  }
  //TODO delete this and add a decorator!!
  this.getAdditionalInfo = function() {
    return this.additionalInfo;
  }
  //TODO delete this and add a decorator!!
  this.setAdditionalInfo = function(additionalInfo) {
    this.additionalInfo = additionalInfo;
  }
}

/**
  Abstract class for operator without rrel_set arguments.
  @constructor
  @param {String} type - type of operator
  @param {Array} arguments - arguments of operator
*/
function SimpleOperator(type, arguments) {
  BasicOperator.call(this, type);
  this.setArguments = function(arguments) {
    //Remove this.arguments = [];
    for(var i = 0; i < arguments.length; i++) {
      if (!arguments[i]) continue;
      this.arguments.push(new NumberArgument((i + 1), arguments[i]));
    }
  }
  this.setArguments(arguments);
}
/**
  Abstract class for operator with rrel_set arguments.
  @constructor
  @param {String} type - type of operator
  @param {Array} arguments - arguments of operator
*/
function SetOperator(type, arguments) {
  BasicOperator.call(this, type);
  this.setArguments = function(arguments) {
    for(var i = 0; i < arguments.length; i++) {
      var argument = arguments[i];
      if (!argument) continue;
      if (i < arguments.length / 2)
        this.arguments.push(new NumberArgument((i + 1), argument));
      else 
        this.arguments.push(new NumberSetArgument((i + 1 - arguments.length / 2), argument));
    }
  }
  this.setArguments(arguments); 
}
/**
  Abstract clas for complicated SCP-construction
  @constructor
  @param {Array} operators - operators in constructions
*/
function ComplicatedOperator(operators) {
  Operator.call(this);
  this.operators = operators;
  this.isEmpty = function() {
    return this.operators.length == 0;
  }
  this.toString = function() {
    var body = "";
    for(var i = 0; i < this.operators.length; i++) {
      var operator = this.operators[i];
      if (!operator) continue;
      body += operator.toString();
    }
    return body;
  }
  this.getName = function() {
    return this.operators[0].getName();
  }
  this.setAdditionalInfo = function(additionalInfo) {
    if (!this.isEmpty()) this.operators[0].setAdditionalInfo(additionalInfo);
  }
  while(!this.isEmpty() && this.operators[0].isEmpty()) this.operators.shift();
}

/**
  Abstract class for argument
  @constructor
  @param {String} name - name of argument
*/
function Argument(name) {
  this.identifier = name;
}

/**
  Represents argument set for SCP call operator
  @constructor
  @param {Array} arguments - arguments in the set
*/
function ArgumentSet(arguments) {
  this.setArguments = function(arguments) {
    preparedArguments = [];
    for(var i = 0; i < arguments.length; i++) {
      if (arguments[i]) preparedArguments.push(new NumberArgument((i + 1), arguments[i]));
    }
    this.arguments = preparedArguments;
  }
  this.toString = function() {
    var body = "... (*<br>";
    for(var i = 0; i < this.arguments.length; i++) {
      var argument = this.arguments[i];
      body += "-> " + argument.toString() + ";;<br>";
    }
    body += "*)"
    return body;
  }
  this.setArguments(arguments);
}

/**
  Represents SCP-argument without role relations
  @constructor
  @param {String} name - name of argument
*/
function SimpleArgument(name) {
  Argument.call(this, name);
  this.toString = function() {
    return this.identifier;
  }
}
/**
  Represents SimpleArgument with random name
  @constructor
*/
function RandomArgument() {
  SimpleArgument.call(this, "_argument" + Math.floor(Math.random()*65536));
}
/**
  Abstract class for role relation to some SCP-argument. 
  @constructor
  @param {String} name - name of role relation
  @param {Argument} argument - argument
*/
function ArgumentDecorator(name, argument) {
  Argument.call(this, name);
  this.argument = argument;
  this.toString = function() {
    return "rrel_" + this.identifier + ": " + this.argument.toString();
  }
}

/**
  Abstract class for transition between operators
  @constructor
  @param {String} name - name of role relation
  @param {Operator} operator - destination
*/
function Transition(name, operator) {
  this.name = name;
  this.operator = operator;
  this.toString = function() {
    var body = "";
    if (this.operator) body += "=> nrel_" + this.name + ": " + this.operator.getName() + ";;<br>";
    return body;
  }
  this.getOperator = function() {
    return this.operator;
  }
}
/**
  Represents a goto transition
  @constructor
  @param {Operator} nextOperator - destination
*/
function GotoTransition(nextOperator) {
  Transition.call(this, "goto", nextOperator);
}
/**
  Represents a then transition
  @constructor
  @param {Operator} thenOperator - destination
*/
function ThenTransition(thenOperator) {
  Transition.call(this, "then", thenOperator);
}
/**
  Represents an else transition
  @constructor
  @param {Operator} elseOperator - destination
*/
function ElseTransition(elseOperator) {
  Transition.call(this, "else", elseOperator);
}