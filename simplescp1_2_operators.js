function CallOperator(arguments) {
  SimpleOperator.call(this, "call", arguments);
}
function WaitReturnOperator(arguments) {
  SimpleOperator.call(this, "waitReturn", arguments);
}
function GenElOperator(arguments) {
  SimpleOperator.call(this, "genEl", arguments);
}
function GenElStr3Operator(arguments) {
  SimpleOperator.call(this, "genElStr3", arguments);
}
function GenElStr5Operator(arguments) {
  SimpleOperator.call(this, "genElStr5", arguments);
}
function SearchElOperator(arguments) {
  SimpleOperator.call(this, "searchEl", arguments);
}
function SearchElStr3Operator(arguments) {
  SimpleOperator.call(this, "searchElStr3", arguments);
}
function SearchElStr5Operator(arguments) {
  SimpleOperator.call(this, "searchElStr5", arguments);
}
function EraseElOperator(arguments) {
  SimpleOperator.call(this, "searchEl", arguments);
}
function EraseElStr3Operator(arguments) {
  SimpleOperator.call(this, "searchElStr3", arguments);
}
function EraseElStr5Operator(arguments) {
  SimpleOperator.call(this, "searchElStr5", arguments);
}
function IfVarAssignOperator(arguments) {
  SimpleOperator.call(this, "ifVarAssign", arguments);
}
function GenSetOperator(arguments) {
  SetOperator.call(this, "genSet", arguments);
}
function GenSetStr3Operator(arguments) {
  SetOperator.call(this, "genSetStr3", arguments);
}
function GenSetStr5Operator(arguments) {
  SetOperator.call(this, "genSetStr5", arguments);
}
function SearchSetOperator(arguments) {
  SetOperator.call(this, "searchSet", arguments);
}
function SearchSetStr3Operator(arguments) {
  SetOperator.call(this, "searchSetStr3", arguments);
}
function SearchSetStr5Operator(arguments) {
  SetOperator.call(this, "searchSetStr5", arguments);
}
function EraseSetOperator(arguments) {
  SetOperator.call(this, "searchSet", arguments);
}
function EraseSetStr3Operator(arguments) {
  SetOperator.call(this, "searchSetStr3", arguments);
}
function EraseSetStr5Operator(arguments) {
  SetOperator.call(this, "searchSetStr5", arguments);
}
function EmptyOperator() {
  ComplicatedOperator.call(this, []);
  this.setPreviousOperator = function(previousOperator) {
    this.operators = [previousOperator];
  }
  this.setTransition = function(transition) {
  	this.operators[0].setTransition(transition);
  }
}
function BlockOperator(operators) {
  ComplicatedOperator.call(this, operators);
  this.setTransition = function(transition) {
    this.operators[this.operators.length - 1].setTransition(transition);
  }
}
//TODO add fix when empty statement
function IfOperator(testOperator, thenOperator, elseOperator) {
  ComplicatedOperator.call(this, [testOperator, thenOperator, elseOperator]);
  this.setTransition = function(transition) {
    this.operators[1].setTransition(transition);
    this.operators[2].setTransition(transition);
  }
  testOperator.setTransition(new ConditionalTransition(thenOperator, elseOperator));
}
/*function WhileOperator(testOperator, loopOperator) {
  ComplicatedOperator.call(this, [testOperator, loopOperator]);
  this.setTransition = function(transition) {
    this.operators[1].setTransition(transition);
  }
  testOperator.setTransition(new ConditionalTransition(loopOperator));
  loopOperator
}*/
function CallUserFunctionOperator(calleeArgument, arguments) {
  var process = new RandomArgument();
  var callOperator = new CallOperator([calleeArgument, new ArgumentSet(arguments), new AssignArgument(process)]);
  var waitReturnOperator = new WaitReturnOperator([new FixedArgument(process)]);
  ComplicatedOperator.call(this, [callOperator, waitReturnOperator]);
  this.setTransition = function(transition) {
    this.operators[1].setTransition(transition);
  }
  callOperator.setTransition(new LinearTransition(waitReturnOperator));
}