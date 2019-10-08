import React, {Component} from 'react';
import styled from 'styled-components'
import logo from '../assets/logo.png'
import {CompareList} from '../components/CompareList/index'
import api from '../services/api';
import moment from 'moment';
import {GlobalStyle} from '../styles/global';


const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 60px;
`;

const Form = styled.form`
	margin-top: 20px;
	width: 100%;
	max-width: 400px;
	display: flex;

	input {
		flex: 1;
		heigth: 55px;
		padding: 0 20px;
		background: #FFF;
		border: 0;
		font-size: 18px;
		color: #444;

		border: ${props => (props.withError ? '2px solid #F00' : '0')};
	}

	button {
		height: 55px;
		padding: 0 20px;
		margin-left: 10px;
		background: #63f5b0;
		color: #FFF;
		border 0;
		font-se 20px;
		font-weight: bold;
		border-radius: 3px;

		&:hover {
			background: #52d89f;
		}
	}
`;

export default class Main extends Component {
	state = {
		loading: false,
		repositoryError: false,
		repositoryInput: '',
		repositories: [],
	}

	handleAddRepository = async (e) => {
		e.preventDefault()

		this.setState({
			loading: true
		})

		try{
			const {data: repository} = await api.get(`repos/${this.state.repositoryInput}`)

			repository.lastCommit = moment(repository.pushed_at).fromNow()			

			this.setState({
				repositoryInput: '',
				repositories: [...this.state.repositories, repository],

			})
		}catch(err){
			this.setState({
				repositoryError: true
			})
		}finally{
			this.setState({
				loading: false
			})
		}
	}	

	render(){
		return(
			<React.Fragment>
			<GlobalStyle/>
				<Container>
					<img src={logo} alt="Github Compare"/>
					<Form withError={this.state.repositoryError} onSubmit={this.handleAddRepository}>
						<form>
							<input 
								type="text" 
								placeholder="usuário/repositório"
								value={this.state.repositoryInput}
								onChange={e => this.setState({ repositoryInput: e.target.value})}
							/>
							<button type="submit">{this.state.loading ? <i className="fa fa-spinner fa-pulse"/> : 'Ok'}</button>
						</form>
					</Form>
					<CompareList repositories={this.state.repositories}/>
				</Container>
			</React.Fragment>
		)
	}
}

