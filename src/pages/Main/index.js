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
    loading: null,
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
    this.setState({ newRepo: e.target.value, error: null });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true, error: false });

    try {
     const {newRepo, repositories } = this.state;

     if (newRepo === "") throw 'campo vazio!';

     const hasRepo = repositories.find(e => e.name === newRepo);

     if(hasRepo) throw 'Repositorio já exsite!';

      this.setState({ loading: true });

      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
      });

    } catch (error) {
      this.setState({ error: true });
    } finally {
      this.setState({ loading: false}) ;
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
            placeholder="Digite o nome do repositório"
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

