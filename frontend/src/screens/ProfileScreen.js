import React,{useState,useEffect} from 'react';
import {Row,Col,Form,Button,Table} from 'react-bootstrap';
import {useDispatch,useSelector} from 'react-redux';
import {LinkContainer} from "react-router-bootstrap"
import Loader from "../components/Loader";
import Message from "../components/Message";
import {getUserDetails,updateUserProfile} from "../actions/userActions";
import {listMyOrders} from "../actions/orderActions";
import {USER_UPDATE_PROFILE_RESET} from "../constants/userConstants";

const ProfileScreen=({history})=>{
	const [name,setName]=useState("");
	const [email,setEmail]=useState("");
	const [password,setPassword]=useState("");
	const [confirmPassword,setConfirmPassword]=useState("");
	const [message,setMessage]=useState(null);
	const dispatch=useDispatch();
	const userDetails=useSelector(state=>state.userDetails);
	const {loading,error,user} =userDetails;

	const userLogin=useSelector(state=>state.userLogin)
	const {userInfo}=userLogin;

	const userUpdateProfile=useSelector(state=>state.userUpdateProfile);
	const {success}=userUpdateProfile;

	const orderListMy= useSelector(state=>state.orderListMy);
	const {loading:loadingOrders,orders,error:errorOrders}=orderListMy;

	useEffect(()=>{
		if(!userInfo){
			history.push("/login");
		}else{
			if(!user ||!user.name || success){
				dispatch({type:USER_UPDATE_PROFILE_RESET})
				dispatch(getUserDetails('profile'));
				dispatch(listMyOrders());
			}else{
				setName(user.name);
				setEmail(user.email);
			}
		}
	},[history,userInfo,dispatch,user,success])

	const submitHandler=(e)=>{
		e.preventDefault();
		if(password !== confirmPassword){
			setMessage("Password does not match");
		}else{
			dispatch(updateUserProfile({_id:user._id,name:name,email:email,password:password}))
		}
	}

	return(
		<Row>
			<Col md={3}>
				{loading && <Loader />}
				{error && <Message variant='danger'>{error}</Message>}
				{success && <Message variant='success'>Updated User</Message>}
				{message && <Message variant='danger'>{message}</Message>}
				<Form onSubmit={submitHandler}>
					<Form.Group controlId="name">
						<Form.Label>Name</Form.Label>
						<Form.Control type='text' placeholder='Enter name'
						value={name} onChange={e=>setName(e.target.value)} />
					</Form.Group>
					<Form.Group controlId="email">
						<Form.Label>Email</Form.Label>
						<Form.Control type='email' placeholder='Enter Email'
						value={email} onChange={e=>setEmail(e.target.value)} />
					</Form.Group>
					<Form.Group controlId="password">
						<Form.Label>Password</Form.Label>
						<Form.Control type='password' placeholder='Enter Password'
						value={password} onChange={e=>setPassword(e.target.value)} />
					</Form.Group>
					<Form.Group controlId="confirmPassword">
						<Form.Label>ConfirmPassword</Form.Label>
						<Form.Control type='password' placeholder='Confirm Password'
						value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} />
					</Form.Group>
					<Button variant='primary' type='submit'>
						Update
					</Button>
				</Form>
			</Col>
			<Col md={9}>
				<h2>My Orders</h2>
				{loadingOrders ? <Loader/> : errorOrders? <Message variant='danger'>{error}</Message>:(
					<Table striped bordered hover responsive className='table-sm'>
						<thead>
							<tr>
								<th>ID</th>
								<th>DATE</th>
								<th>TOTAL</th>
								<th>PAID</th>
								<th>DELIVERED</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{orders.map(order=>(
								<tr key={order._id}>
									<td>{order._id}</td>
									<td>{order.createdAt.substring(0,10)}</td>
									<td>{order.totalPrice}</td>
									<td>{order.isPaid ? order.paidAt.substring(0,10) : (
										<i className='fas fa-times' style={{color:'red'}}></i>
									)}</td>
									<td>{order.isDelivered ? order.deliveredAt.substring(0,10):(
										<i className='fas fa-times' style={{color:"red"}}></i>
									)}</td>
									<td>
										<LinkContainer to={`/order/${order._id}`}>
											<Button className='btn-sm' variant='light'>Details</Button>
										</LinkContainer>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				)}
			</Col>
		</Row>
	)
}

export default ProfileScreen;