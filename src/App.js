import { useReducer } from "react";
import DigitButton from "./components/buttons/digiButton.component";
import OperationButton from "./components/buttons/operationButton.component";
import Header from "./components/layouts/header.component";
import "./App.css";

export const actions = {
  addDigit: "add-digit",
  chooseOperation: "choose-operation",
  clear: "clear",
  deleteDigit: "delete-digit",
  evaluate: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case actions.addDigit:
      if(state.overwrite){
        return{
          ...state,
          currentOperand:payload.digit,
          overwrite:false
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case actions.chooseOperation:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case actions.deleteDigit:
      if(state.overwrite){ 
        return {
          ...state,
          overwrite:false,
          currentOperand:null
        }}
      if(state.currentOperand == null) return state
      if(state.currentOperand.length === 1){
        return{
          ...state,
          currentOperand:null
        }
      }
      return{
        ...state,
        currentOperand:state.currentOperand.slice(0,-1)
      }

    case actions.clear:
      return {};

    case actions.evaluate:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      return{
        overwrite:true,
        ...state,
        previousOperand:null,
        operation:null,
        currentOperand: evaluate(state)
      }
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const previous = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(previous) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = previous + current;
      break;
    case "-":
      computation = previous - current;
      break;
    case "*":
      computation = previous * current;
      break;
    case "/":
      computation = previous / current;
  }
  return computation.toString();
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div>
      <Header />
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">
            {previousOperand}
            {operation}
          </div>
          <div className="current-operand">{currentOperand}</div>
        </div>
        <button
          className="span-two"
          onClick={() => dispatch({ type: actions.clear })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: actions.deleteDigit })}>
          DEL
        </button>
        <OperationButton operation="/" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button
          className="span-two"
          onClick={() => dispatch({ type: actions.evaluate })}
        >
          =
        </button>
      </div>
    </div>
  );
}

export default App;
