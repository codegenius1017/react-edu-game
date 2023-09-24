
import { Component, useEffect, useState } from 'react';

const s = {
  style: {
    fontSize: '60px',
  },
};

class MyErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para que a próxima renderização mostre a UI alternativa.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Você também pode registrar o erro em um serviço de relatórios de erro
    console.log("deu esse erro aqui ------> ",error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI alternativa
      return <p {...s}>Deu ruim =(</p>;
    }

    return this.props.children;
  }
}

const ItWillThrowErrorEvent = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (counter > 3) {
      throw new Error('Que chato!!!');
    }
  }, [counter]);

  return (
    <div>
      <button {...s} onClick={(e) => {
        setCounter((s) => s + 1)
        if (counter > 3) {
          throw new Error('Que chato!!!');
        }
      }}>
        Click to increase {counter}
      </button>
    </div>
  );
};
const ItWillThrowError = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (counter > 3) {
      throw new Error('Que chato!!!');
    }
  }, [counter]);

  return (
    <div>
      <button {...s} onClick={() => setCounter((s) => s + 1)}>
        Click to increase {counter}
      </button>
    </div>
  );
};

const ItWillThrowErrorAsync = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (counter > 3) {
      setTimeout(() => {
        throw new Error('Que chato!!!');
      }, 2000);
    }
  }, [counter]);

  return (
    <div>
      <button {...s} onClick={() => setCounter((s) => s + 1)}>
        Click to increase {counter}
      </button>
    </div>
  );
};

const ItWillThrowErrorAsync2 = () => {
  const [counter, setCounter] = useState(0);

  function getData(){
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        throw new Error('Que chato!!!');
        resolve();
      }, 2000);
    })
  }

  useEffect(() => {
    if (counter > 3) {
     getData().then((res) => {
      throw new Error("affs");
     })
    }
  }, [counter]);

  return (
    <div>
      <button {...s} onClick={() => setCounter((s) => s + 1)}>
        Click to increase {counter}
      </button>
    </div>
  );
};

export const Home = () => {
  return (
    <div {...s}>
      <MyErrorBoundary>
        <ItWillThrowError />
      </MyErrorBoundary>
      <MyErrorBoundary>
        <ItWillThrowError />
      </MyErrorBoundary>
      <MyErrorBoundary>
        <ItWillThrowError />
      </MyErrorBoundary>
      <MyErrorBoundary>
        <ItWillThrowError />
      </MyErrorBoundary>
      <MyErrorBoundary>
        <ItWillThrowError />
      </MyErrorBoundary>
      <MyErrorBoundary>
        <ItWillThrowError />
      </MyErrorBoundary>
      <MyErrorBoundary>
        <ItWillThrowErrorEvent />
      </MyErrorBoundary>
      <MyErrorBoundary>
        <ItWillThrowErrorAsync />
      </MyErrorBoundary>
      <MyErrorBoundary>
        <ItWillThrowErrorAsync2 />
      </MyErrorBoundary>
      {/* <MyErrorBoundary> */}
        <ItWillThrowError />
      {/* </MyErrorBoundary>s */}
    </div>
  );
};
