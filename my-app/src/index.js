import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// 함수 컴포넌트 - state없이 render함수만을 갖도록 정의
// React.Component를 확장하는 클래스의 정의 대신
// props를 입력받아 렌더링할 대상을 반환하는 함수를 작성
function Square(props) {
  // React 컴포넌트는 생성자에서 state를 정의할 수 있다
  // JS에서 하위클래스의 생성자를 정의하는 경우 항상 super를 호출해야함
  return (
    <button
      className="square"
      // 함수 컴포넌트로 수정 시 곧바로 함수를 객체로 넘길 수 있다
      // 화살표 함수 필요 없음
      onClick={props.onClick}
      // 부모 클래스로부터 정보를 받아오고 필요한 정보를 전달하는
      // 방식으로 운영되는 ontrolled component
      // 인자로 받은 props를 곧바로 사용
    >
      {props.value}
    </button>
  );
}

// React.Component의 하위 클래스로 정의
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    // 기존의 배열을 수정하지 않고 복사본을 수정한 후 교체
    // 불변성
    // -> 직접적인 데이터 변이는 history를 유지하고 재사용하기 어렵게 함
    // -> 변화를 감지하기 용이하다 (equal or non-equal)
    // -> 이를 기반으로 다시 렌더링되는 시기를 결정
    const squares = this.state.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      squares: squares,
      // 실제 메모리가 할당된 instance가 아니므로 this로 동적으로 가리켜야 함
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    // 컴포너트명으로 정의된 tag는 class의 instance처럼 사용
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    // 개별 컴포넌트는 props를 매개변수로 받아오고 render함수를
    // 통해 화면에 표시할 뷰 계층 구조를 반환함

    // render함수는 화면에서 나타내고자 하는 내용을 반환함

    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      // XML과 유사한 태크로 구성된 컴포넌트를 사용해
      // React에 화면에 표현하고자 하는 바를 정의하고
      // data가 변경될 때 React는 컴포넌트를 효율적으로
      // 업데이트하고 다시 렌더링함

      // render는 렌더링할 내용을 경량화한 React element를 반환함
      // JSX 문법을 주로 사용함 -> 빌드하는 시점에 createElement로 변환됨
      // React element는 JS의 객체로 변수에 저장하거나 전달가능함
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          {/* 컴포넌트명으로 정의된 tag내에서는 해당 컴포넌트의 모든
          property들을 참조할 수 있음 */}
          <Board />
        </div>
        <div className="game-info">
          <div></div>
          <ol></ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

ReactDOM.render(<Game />, document.getElementById("root"));
