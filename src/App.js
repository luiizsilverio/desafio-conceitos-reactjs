import React, { useState, useEffect } from 'react';
import api from './services/api';
import "./styles.css";

function App() {
  const [repositorios, setRepositorios] = useState([]);

  // Chama a API (método GET, rota /projects)
  useEffect(() => {
    api.get('/repositories').then(resp => {
        setRepositorios(resp.data);
    })
  }, []);

  async function handleAddRepository() {
    const inputNew = document.getElementById('newProj')
    let nome
    
    if (inputNew) {
      nome = inputNew.value
    } else {
      nome = `Novo projeto ${Date.now()}`
    } 

    inputNew.value = ""

    const response = await api.post('/repositories',  
      {
        //title: `${nome.value}`,
        title: `${ nome }`, 
        url: "http://localhost",
        techs: ["html", "css", "javascript"]
      })

      setRepositorios([ ...repositorios, response.data])
  }  

  async function handleRemoveRepository(id) {    
    await api.delete(`repositories/${ id }`)
    
    const indice = repositorios.findIndex(rep => rep.id === id)

    if (indice >= 0) {
      repositorios.splice(indice, 1);
      setRepositorios([...repositorios]);
    }    
  }

  function btnRemover(id) {
    return (
        <button onClick={() => handleRemoveRepository(id)}>
            Remover
        </button>
    )
  }

  return (
    <div>
      <h2>Lista de Projetos</h2>
      <ul data-testid="repository-list">             
        { 
          repositorios.map(rep => (
            <li key={ rep.id }>{ rep.title }
            { btnRemover(rep.id) }
            </li>
          ))
        }
      </ul>
      <form className="form-add">
        <input type="text" id="newProj" autoFocus autoComplete="off" placeholder="Digite o nome do projeto"/>
        <button onClick={handleAddRepository} type="button">Adicionar</button>
      </form>
    </div>
  );
}

export default App;
