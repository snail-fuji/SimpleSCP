PATH_TO_V8="./d8"
PATH_TO_SIMPLESCP="../"
for file in $(ls -r *.sscp) 
do
  echo $file
  $PATH_TO_V8 ../esprima.js ../simplescp1_2.js ../simplescp1_2_modifiers.js ../simplescp1_2_operators.js ../simplescp1_2_parser.js -e "print(consoleParse('$(echo $(cat $file))'));" > "$file.scs"
done

