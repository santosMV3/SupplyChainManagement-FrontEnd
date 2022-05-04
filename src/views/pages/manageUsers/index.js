import React, {useState, useEffect} from "react";
// nodejs library that concatenates classes
// reactstrap components

import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  Navbar,
  NavbarBrand
} from "reactstrap";
import {useHistory} from "react-router-dom";
import {api} from "../../../services/api";
import {DangerAlert} from"../components/custom/alerts";

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const ManageUsers = ({...props}) => {
    const history = useHistory();
    const [userRegister, setUserRegister] = useState({
        email: "",
        username: "",
        password: "",
        groups: [],
        first_name: "",
        last_name: "",
        is_superuser: false,
        is_staff: false
      });
    
      const classes = useStyles();
      const [permission, setPermission] = useState([]);
      const [selected, setSelect] = useState('');
      const handleChange = (event) => {
        setSelect(event.target.value);
      };
      const handlerInput = (e) => {
        setUserRegister({...userRegister, [e.target.id]: e.target.value});
      };

      const getPermissions = () => api.get('/permissions/').then((response) => {
        setPermission(response.data);
      }).catch(console.error);

      useEffect(() => {
        let abortController = new AbortController();
        getPermissions();
        return () => abortController.abort();
      }, []);

      const registerExecute = async (e) => {
        e.preventDefault();

        // const groupValue = document.getElementById('groups').value;
        const superuser = false;
        // if (groupValue === "") return window.alert('Por favor, selecione um grupo de usuário!');
        // userRegister.groups = [groupValue];
        userRegister.is_superuser = superuser;

        api.post('/users/', userRegister).then((response) => {
          api.post('/user-permission/', {idUser: response.data.id, idPermission: selected})
          .then((response) => {
            window.alert('Success to register a new user!');
            props.refresh(true);
          }).catch(console.error);
        }).catch((error) => {
          if(error.response){
            const data = error.response.data;
            let message = "";
    
            if (data.username){
              data.username.forEach(uniqueData => {
                message+= `\n ${uniqueData}`
              });
            } else if(data.detail){
              return history.push('/auth/login');
            }
            
            window.alert(message);
          }else{
            window.alert('Não foi possível se comunicar com o servidor...')
          }
        });
    
        }

    return (
        <>
      <Container>
        <Row className="justify-content-center">
          <Col style={{padding: '0'}}>
            <Card className="bg-secondary border-0">
            <Navbar className="navbar-horizontal navbar-dark bg-default"expand="lg" style={{
                  width: '100%',
                  height: '50px'
              }}>
                  <Container>
                      <NavbarBrand style={{cursor: 'default', userSelect:'none'}}>
                          Create New User
                      </NavbarBrand>
                      <Button color="danger" size="sm" type="button" onClick={props.close}>
                          Close
                      </Button>
                  </Container>
              </Navbar>
              <CardBody className="px-lg-5 py-lg-5" >
                <Form role="form" onSubmit={registerExecute}>
                  <FormGroup>
                    <InputGroup className="input-group-merge input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-hat-3" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Username"
                        type="text"
                        id="username"
                        onChange={handlerInput}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup className="input-group-merge input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Email"
                        type="email"
                        id="email"
                        onChange={handlerInput}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px"
                  }}>
                    <InputGroup className="input-group-merge input-group-alternative mb-3" style={{
                      width: "48%",
                      marginRight: "15px"
                    }}>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-single-02"/>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Firts Name"
                        type="text"
                        id="first_name"
                        onChange={handlerInput}
                      />
                    </InputGroup>
                    <InputGroup className="input-group-merge input-group-alternative mb-3" style={{
                      width: "48%"
                    }}>
                      <Input
                        placeholder="Last Name"
                        type="text"
                        id="last_name"
                        onChange={handlerInput}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Password"
                        type="password"
                        id="password"
                        onChange={handlerInput}
                      />
                    </InputGroup>
                  </FormGroup>
                  <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FormControl variant="outlined" required className={classes.formControl}>
                      <InputLabel id="demo-simple-select-outlined-label">Permission</InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={selected}
                        onChange={handleChange}
                        label="Permission"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {permission.map((data, index) => (<MenuItem key={`menuitem-${index}`} value={data.idPermission}>{data.name}</MenuItem>))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="text-center">
                    <Button className="mt-4" color="info" type="submit">
                      Create account
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <DangerAlert/>
      </Container>
    </>
    )
}

export default ManageUsers
