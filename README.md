# SimpleSCP
SimpleSCP to SCP translator based on Esprima parser.

My attemp to do SCP programs more readable. Just look at SCP program:
```
scp_program -> example(*
  -> rrel_params: ... (*
  *);;
  -> rrel_operators: ... (*
    -> rrel_init: ..operator1 (*
      <- print;;
      -> rrel_1: rrel_fixed: rrel_scp_const: [Hello world!];;
      => nrel_goto: ..operator2;;
    *);;
    -> ..operator2 (*
      <- return;;
    *);;
  *);;
*);;

```

The same code in SimpleSCP:
```
function example() {
  print("Hello world!");
}
```

