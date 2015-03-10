const searchEl = "searchEl";
const searchElStr3 = "searchElStr3";
const searchElStr5 = "searchElStr5";
const genEl = "genEl";
const genElStr3 = "genElStr3";
const genElStr5 = "genElStr5";
const eraseEl = "eraseEl";
const eraseElStr3 = "eraseElStr3";
const eraseElStr5 = "eraseElStr5";
const printNl = "printNl";

const fixed = "fixed";
const assign = "assign";
var modifiers = [
  fixed,
  assign,     
];
var operatorNumber = 1;
var program = "";


//TODO fund abstractions and create objects to clean this code from repeats

function search(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive) {
  if (arguments.length == 1)
    return search1(parameterOne);
  else if (arguments.length == 3)
    return search3(parameterOne, parameterTwo, parameterThree);
  else if (arguments.length == 5)
    return search5(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive);
}

function search1(parameter) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: searchEl,
      1: parameter,
      then: [],
      else: [],
    }
  );
}

function search3(parameterOne, parameterTwo, parameterThree) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: searchElStr3,
      1: parameterOne,
      2: parameterTwo,
      3: parameterThree,
      then: [],
      else: [],
    }
  );
}

function search5(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: searchElStr5, 
      1: parameterOne, 
      2: parameterTwo,
      3: parameterThree,
      4: parameterFour,
      5: parameterFive,
      then: [],
      else: [],
    }
  );
}

function gen(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive) {
  if (arguments.length == 1)
    return gen1(parameterOne);
  else if (arguments.length == 3)
    return gen3(parameterOne, parameterTwo, parameterThree);
  else if (arguments.length == 5)
    return gen5(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive);
}

function gen1(parameter) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: genEl,
      1: parameter,
      goto: [],
    }
  );
}

function gen3(parameterOne, parameterTwo, parameterThree) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: genElStr3,
      1: parameterOne,
      2: parameterTwo,
      3: parameterThree,
      goto: [],
    }
  );
}

function gen5(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: genElStr5, 
      1: parameterOne, 
      2: parameterTwo,
      3: parameterThree,
      4: parameterFour,
      5: parameterFive,
      goto: [],
    }
  );
}

function erase(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive) {
  if (arguments.length == 1)
    return erase1(parameterOne);
  else if (arguments.length == 3)
    return erase3(parameterOne, parameterTwo, parameterThree);
  else if (arguments.length == 5)
    return erase5(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive);
}

function erase1(parameter) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: eraseEl,
      1: parameter,
      goto: [],
    }
  );
}

function erase3(parameterOne, parameterTwo, parameterThree) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: eraseElStr3,
      1: parameterOne,
      2: parameterTwo,
      3: parameterThree,
      goto: [],
    }
  );
}

function erase5(parameterOne, parameterTwo, parameterThree, parameterFour, parameterFive) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: eraseElStr5, 
      1: parameterOne, 
      2: parameterTwo,
      3: parameterThree,
      4: parameterFour,
      5: parameterFive,
      goto: [],
    }
  );
}

function print(parameter) {
  return scp(
    {
      name: getOperatorName(getOperatorNumber()),
      type: printNl,
      1: parameter,
      goto: [],
    }
  );
}

function scp(syntax) {	
  body = " <- " + syntax["name"] + " (*<br><- " + syntax["type"] + ";;<br>";
  for (var i = 1; i < 6; i++) {
    if (syntax[i] != undefined) {
      body += "<- rrel_" + i + ": " + parseArgument(syntax[i]);
    }
    set = ("set_" + i);
    if (syntax[set] != undefined) {

      body += "<- rrel_" + set + ": " + parseArgument(syntax[set]);
    }
  }
  if ("goto" in syntax) body += parseTransitions("nrel_goto", syntax["goto"]);
  if ("then" in syntax) body += parseTransitions("nrel_then", syntax["then"]);
  if ("else" in syntax) body += parseTransitions("nrel_else", syntax["else"]);
  body += "*);;<br>"
  program += body;
  increaseOperatorNumber();
  return body;
}

function parseTransitions(nrel, syntax) {
  body = "";
  if (syntax.length == 0) {
    body = "=>" + nrel + ": " + getOperatorName(getOperatorNumber() + 1) + ";;<br>"
  }
  else {
    for(var i = 0; i < syntax.length; i++) {
      body += "=> " + nrel + ": " + syntax[i] + ";;<br>";
    }
  }
  return body;
}

function parseArgument(syntax) {
  argument = "";
  for(var i = 0; i < syntax.length; i++) {
    element = syntax[i];
    if (isModifier(element))
      argument += "rrel_" + element + ": ";
    else {
      argument += element + ";;<br>"
      break;
    }
  }
  return argument;
}

function isModifier(modifier) {
  return modifiers.indexOf(modifier) != -1;  
}

function getOperatorName(number) {
	return "..operator" + number;
}

function getOperatorNumber() {
	return operatorNumber;
}

function increaseOperatorNumber() {
	return ++operatorNumber;
}

function parse(syntax)
{
  program = "";
  eval(syntax);
  return program;
}


