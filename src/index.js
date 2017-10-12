import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={props.style}>
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        style={{backgroundColor: this.props.bgColors[i]}}
      />
    );
  }

  render() {
    const rows = [];
    
    for(let i = 0; i < 3; i++) {
      let cells = [];

      for (let j = 0; j < 3; j++) {
        let cell = this.renderSquare(i*3 + j);
        cells.push(cell);
      }
      
      let row =  <div key={i} className="board-row">{cells}</div>;
      rows.push(row);        
    }

    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      moveHistory: [{
        move: Array(2).fill(null)
      }],
      selection: null,
      descending: false,
      bgColorHistory: [{
        bgColor: Array(9).fill('white')
      }]
    };
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const moveHistory = this.state.moveHistory.slice(0, this.state.stepNumber + 1);
    const bgColorHistory = this.state.bgColorHistory.slice(0, this.state.stepNumber + 1);
    
    
    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    
    const winner = calculateWinner(squares);
    let bgColor = bgColorHistory[bgColorHistory.length - 1];
    
    if  (winner) {
      for (let i = 0; i < winner.length; i++) {
        bgColor[winner[i]] = 'yellow'
      }
    }

    this.setState({
      history: history.concat([{squares: squares}]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      moveHistory: moveHistory.concat({move: [Math.floor(i/3) + 1, (i % 3) + 1]}),
      selection: null,
      bgColorHistory: bgColorHistory.concat([{bgColor: bgColor}])
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moveHistory= this.state.moveHistory;
    const bgColorHistory = this.state.bgColorHistory;
    const curentBgColor = bgColorHistory[this.state.stepNumber];
    
    
    const moves = history.map((step, move) => {
      const style = this.state.selection === move ? {"fontWeight": "bold"} : null
      const desc = move ? 
        'Go to move #' + move + ' (' + moveHistory[move].move + ')':
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => { 
            this.setState({
              selection: move
            });
            this.jumpTo(move)
          }
          } style={style}>{desc}</button>
        </li>
      )
    })

    if (this.state.descending) moves.reverse();


    let status;
    if (winner)
      status = 'Winner: ' + current.squares[winner[0]];
    else
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
            bgColors = {curentBgColor.bgColor}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={() => {
            this.setState({
            descending: !this.state.descending
            })
          }}>Change order</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
  

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
      return lines[i];
    }
  }
  return null;
}