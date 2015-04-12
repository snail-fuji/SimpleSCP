function PrintOperator(arguments) {
  SimpleOperator.call(this, "print", arguments);
}
function ReturnOperator() {
  SimpleOperator.call(this, "return", []);
}
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
  SimpleOperator.call(this, "eraseEl", arguments);
}
function EraseElStr3Operator(arguments) {
  SimpleOperator.call(this, "eraseElStr3", arguments);
}
function EraseElStr5Operator(arguments) {
  SimpleOperator.call(this, "eraseElStr5", arguments);
}
function IfVarAssignOperator(arguments) {
  SimpleOperator.call(this, "ifVarAssign", arguments);
}
function VarAssignOperator(arguments) {
  SimpleOperator.call(this, "varAssign", arguments);
}
function ContAssignOperator(arguments) {
  SimpleOperator.call(this, "contAssign", arguments);
}
function ContAddOperator(arguments) {
  SimpleOperator.call(this, "contAdd", arguments);  
}
function ContSubtractOperator(arguments) {
  SimpleOperator.call(this, "contSub", arguments);
}
function ContMultipleOperator(arguments) {
  SimpleOperator.call(this, "contMult", arguments);
}
function ContDivideOperator(arguments) {
  SimpleOperator.call(this, "contDiv", arguments);
}
function ContCosOperator(arguments) {
  SimpleOperator.call(this, "contCos", arguments);
}
function ContSinOperator(arguments) {
  SimpleOperator.call(this, "contSin", arguments);
}
function ContArccosOperator(arguments) {
  SimpleOperator.call(this, "contACos", arguments);
}
function ContArcsinOperator(arguments) {
  SimpleOperator.call(this, "contASin", arguments);
}
function IfGreaterOperator(arguments) {
  SimpleOperator.call(this, "ifGr", arguments);
}
function SysGenerateOperator(arguments) {
  SimpleOperator.call(this, "sys_gen", arguments);
}
function SysSearchOperator(arguments) {
  SimpleOperator.call(this, "sys_search", arguments);
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
  SetOperator.call(this, "eraseSet", arguments);
}
function EraseSetStr3Operator(arguments) {
  SetOperator.call(this, "eraseSetStr3", arguments);
}
function EraseSetStr5Operator(arguments) {
  SetOperator.call(this, "eraseSetStr5", arguments);
}
function EmptyOperator() {
  ComplicatedOperator.call(this, []);
  this.addTransition = function(transition) {
  }
}
function BlockOperator(operators) {
  ComplicatedOperator.call(this, operators);
  this.addTransition = function(transition) {
    //TODO There is an error!!!!!
    if (!this.isEmpty()) 
      this.operators[this.operators.length - 1].addTransition(transition);
  }
}

function IfOperator(testOperator, thenOperator, elseOperator) {
  ComplicatedOperator.call(this, [testOperator, thenOperator, elseOperator]);
  //TODO Split this method
  this.addTransition = function(transition) {
    if (!this.operators[1].isEmpty() && !this.operators[2].isEmpty()) {
      this.operators[1].addTransition(transition);
      this.operators[2].addTransition(transition);
    }
    else if (!this.operators[1].isEmpty()) {
      this.operators[1].addTransition(transition);
      this.operators[0].addTransition(new ElseTransition(transition.getOperator()));
    }
    else if (!this.operators[2].isEmpty()) {
      this.operators[2].addTransition(transition);
      this.operators[0].addTransition(new ThenTransition(transition.getOperator()));
    }
    else 
      this.operators[0].addTransition(transition);
  }
  this.initTransitions = function() {
    if (!this.operators[1].isEmpty())
      this.operators[0].addTransition(new ThenTransition(this.operators[1]));
    if (!this.operators[2].isEmpty())
      this.operators[0].addTransition(new ElseTransition(this.operators[2]));
  }
  this.initTransitions();
}

function WhileOperator(testOperator, loopOperator) {
  ComplicatedOperator.call(this, [testOperator, loopOperator]);
  this.addTransition = function(transition) {
      this.operators[0].addTransition(new ElseTransition(transition.getOperator()));
  }
  this.initTransitions = function() {
    if (!this.operators[1].isEmpty()) {
      this.operators[0].addTransition(new ThenTransition(this.operators[1]));
      this.operators[1].addTransition(new GotoTransition(this.operators[0]));
    }
    else {
      this.operators[0].addTransition(new ThenTransition(this.operators[0]));
    }
  }
  this.initTransitions();
}

function ForInOperator(iterator, iterable) {
  ComplicatedOperator.call(this, [testOperator, loopOperator]);
  this.addTransition = function(transition) {
      this.operators[0].addTransition(new ElseTransition(transition.getOperator()));
  }
  this.initTransitions = function() {
    if (!this.operators[1].isEmpty()) {
      this.operators[0].addTransition(new ThenTransition(this.operators[1]));
      this.operators[1].addTransition(new GotoTransition(this.operators[0]));
    }
    else {
      this.operators[0].addTransition(new ThenTransition(this.operators[0]));
    }
  }
  this.initTransitions();
}

/*function DoWhileOperator(testOperator, loopOperator) {
  ComplicatedOperator.call(this, [loopOperator, testOperator]);
  this.addTransition = function(transition) {
    if (this.operators[0] && !this.operators[0].isEmpty()) {
      this.operators[1].addTransition(new ThenTransition(this.operators[0]));
      this.operators[1].addTransition(new ElseTransition(transition.getOperator()));
      this.operators[0].addTransition(new GotoTransition(this.operators[0]));
    }
    else
      this.operators[1].addTransition(transition);
  }
}*/
function CallUserFunctionOperator(calleeArgument, arguments) {
  var process = new RandomArgument();
  var callOperator = new CallOperator([calleeArgument, new ArgumentSet(arguments), new AssignArgument(process)]);
  var waitReturnOperator = new WaitReturnOperator([new FixedArgument(process)]);
  ComplicatedOperator.call(this, [callOperator, waitReturnOperator]);
  this.addTransition = function(transition) {
    this.operators[1].addTransition(transition);
  }
  callOperator.addTransition(new GotoTransition(waitReturnOperator));
}