function FixedArgument(argument) {
  ArgumentDecorator.call(this, "fixed", argument);
}
function AssignArgument(argument) {
  ArgumentDecorator.call(this, "assign", argument);
}
function NodeArgument(argument) {
  ArgumentDecorator.call(this, "node", argument);
}
function EdgeArgument(argument) {
  ArgumentDecorator.call(this, "edge", argument);
}
function ArcArgument(argument) {
  ArgumentDecorator.call(this, "arc", argument);
}
function PosConstPermArgument(argument) {
  ArgumentDecorator.call(this, "pos_const_perm", argument);
}
function EraseArgument(argument) {
  ArgumentDecorator.call(this, "erase", argument);
}
function ScpVarArgument(argument) {
  ArgumentDecorator.call(this, "scp_var", argument);
}
function ScpConstArgument(argument) {
  ArgumentDecorator.call(this, "scp_const", argument);
}
function ConstArgument(argument) {
  ArgumentDecorator.call(this, "const", argument);
}
function CommonArgument(argument) {
  ArgumentDecorator.call(this, "common", argument);
}
function NumberArgument(number, argument) {
  ArgumentDecorator.call(this, number, argument);
}
function NumberSetArgument(number, argument) {
  ArgumentDecorator.call(this, "set_" + number, argument);
}
function InArgument(argument) {
  ArgumentDecorator.call(this, "in", argument);
}
function OutArgument(argument) {
  ArgumentDecorator.call(this, "out", argument);
}
function LinkArgument(argument) {
  ArgumentDecorator.call(this, "link", argument);
}