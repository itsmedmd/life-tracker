import React from 'react';
import { connect } from 'react-redux';
import { signup } from '../../store/actions/authActions';
import { Redirect } from 'react-router-dom';

class SignUp extends React.Component {
    state = {
        email: '',
        password: '',
        passwordRepeat: ''
    }
    
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.password === this.state.passwordRepeat)
            this.props.signup(this.state);
    }

    render() {
        if(this.props.uid)
            return <Redirect to='/'/>
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <h5>Sign up</h5>
                    <label htmlFor="email">Email</label>
                    <input onChange={this.handleChange} type="email" id="email" required/>

                    <label htmlFor="password">Password</label>
                    <input onChange={this.handleChange} type="password" id="password" required/>

                    <label htmlFor="passwordRepeat">Repeat password</label>
                    <input onChange={this.handleChange} type="password" id="passwordRepeat" required/>

                    <button type="submit">Sign up</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        uid: state.firebase.auth.uid
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        signup: (credentials) => dispatch(signup(credentials))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
