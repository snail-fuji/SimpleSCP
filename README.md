# SimpleSCP
SimpleSCP to SCP translator based on Esprima parser.

My attemp to do SCP programs more readable. Just look at SCP operator:
```
... (*
  <- searchElStr3;;
  -> rrel_1: rrel_scp_var: rrel_fixed: a;
  -> rrel_2: rrel_scp_var: rrel_assign: b;
  -> rrel_3: rrel_scp_var: rrel_fixed: c;
*);;
```

The same code in SimpleSCP:
```
search([fixed, a], [assign, b], [fixed, c]);
```


# SimpleSCP levels
## Simple level
Need if you should write pretty readable code.
```
if (search([fixed, a], [assign, b], [fixed, c])) {
  print("Solution!");
}
```
## SCP level
Need if you should write special SCP construction (You're so weird). 
```
scp(
  {
    name: "operator1"
    type: searchElStr3;
    1: [fixed, a];
    2: [assign, b];
    3: [fixed, c];
    then: ["operator2"];
    else: ["return"];
  }
);
scp(
  {
    name: "operator2"
    type: print;
    1: ["Solution!"];
    goto: ["return"];
  }
);
```
