import React, { Component } from 'react';

import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container/index';

import { Form, SubmitButton, List } from './styles.js';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  };

  //carrega os dados do localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) }); //parse conver de Json para Objeto;
    }
  }

  // Salva os dados do localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    const { newRepo, repositories } = this.state;

    if (newRepo.length <= 0 || newRepo.length == "") {
      alert("Digite um repositório!");
      return;
    };
    try {

      this.setState({ loading: true });

      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
      });

    } catch (error) {
      console.log(error.response);

      if (error.response.status === 404) {
        alert("Repositorio não encontrado!");
      } else {
        alert("Ocorreu algum erro ao tentar obter dados deste repositorio, verifique e tente novamente!");
      }

      this.setState({
        newRepo: '',
        loading: false,
      });
    }
  };

  render() {
    const { repositories, newRepo, loading } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
            Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Digite um repositório e clica no +"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading ? 1 : 0}>
            {
              loading ? (<FaSpinner color="#FFF" size={14} />) : (<FaPlus color="#FFF" size={14} />)
            }
          </SubmitButton>
        </Form>

        <List>


          {
            repositories ?
              repositories.map(repository => (
                <li key={repository.name}>
                  <span>{repository.name}</span>
                  <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
                </li>
              ))
              : <Link to={"/"}></Link>
          }
        </List>

      </Container>
    );
  }
}

