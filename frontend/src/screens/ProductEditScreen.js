import React,{useState,useEffect} from 'react';
import axios from "axios";
import {Form,Button} from 'react-bootstrap';
import {useDispatch,useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import Message from '../components/Message';
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import {listProductDetails,updateProduct} from "../actions/productActions";
import {PRODUCT_UPDATE_RESET} from "../constants/productConstants";

const ProductEditScreen=({match,history})=>{
	const productId = match.params.id;
	const [name,setName]=useState("");
	const [price,setPrice]=useState(0);
	const [image,setImage]=useState("");
	const [brand,setBrand]=useState("");
	const [category,setCategory]=useState("");
	const [countInStock,setCountInStock]=useState(0);
	const [description,setDescription]=useState("");
	const [uploading,setUploading]=useState(false);

	const dispatch=useDispatch();

	const productDetails=useSelector(state=>state.productDetails);
	const {loading,error,product}=productDetails;

	const productUpdate = useSelector(state => state.productUpdate);
	const {loading:loadingUpdate,error:errorUpdate,success:successUpdate} = productUpdate;

	useEffect(()=>{
		if(successUpdate){
			dispatch({type:PRODUCT_UPDATE_RESET});
			history.push("/admin/productList")
		}else{
			if(!product.name || product._id!==productId){
				dispatch(listProductDetails(productId));
			}else{
				setName(product.name);
				setPrice(product.price);
				setImage(product.image);
				setBrand(product.brand);
				setCategory(product.category);
				setCountInStock(product.countInStock);
				setDescription(product.description);
			}	
		}			
	},[dispatch,productId,product,history,successUpdate])

	const submitHandler=(e)=>{
		e.preventDefault();
		dispatch(updateProduct({
			_id:productId,
			name,
			price,
			image,
			brand,
			category,
			description,
			countInStock
		}))
	}

	const uploadFileHandler=async(e)=>{
		const file= e.target.files[0];
		const formData= new FormData();
		formData.append("image",file);
		setUploading(true);
		try{
			const config={
				headers:{
					'Content-Type':"multipart/form-data"
				}
			}
			const {data} = await axios.post("/api/uploads",formData,config);
			setImage(data);
			setUploading(false);
		}catch(error){
			console.error(error);
			setUploading(false);
		}
	}

	return(
		<React.Fragment>
			<Link to='/admin/productList' className='btn btn-light my-3' >
				Go Back
			</Link>
			<FormContainer>
				<h1>Edit Product Details</h1>
				{loadingUpdate && <Loader/>}
				{errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
				{loading ? <Loader /> : error ? <Message varaint='danger'>{error}</Message> : (
					<Form onSubmit={submitHandler}>
						<Form.Group controlId="name">
							<Form.Label>Enter Name</Form.Label>
							<Form.Control type='name' placeholder='Enter Name'
							value={name} onChange={e=>setName(e.target.value)}/>
						</Form.Group>
						<Form.Group controlId="price">
							<Form.Label>Enter price</Form.Label>
							<Form.Control type='number' placeholder='Enter price'
							value={price} onChange={e=>setPrice(e.target.value)}/>
						</Form.Group>
						<Form.Group controlId="image">
							<Form.Label>Enter Image</Form.Label>
							<Form.Control type='text' placeholder='Enter Image'
							value={image} onChange={e=>setImage(e.target.value)}/>
							<Form.File id='image-file' 
							label='Choose file'
							custom onChange={uploadFileHandler} />
							{uploading && <Loader />}
						</Form.Group>
						<Form.Group controlId="brand">
							<Form.Label>Enter Brand</Form.Label>
							<Form.Control type='text' placeholder='Enter Brand'
							value={brand} onChange={e=>setBrand(e.target.value)}/>							
						</Form.Group>
						<Form.Group controlId="countInStock">
							<Form.Label>Enter Count In Stock</Form.Label>
							<Form.Control type='number' placeholder='Enter count In Stock'
							value={countInStock} onChange={e=>setCountInStock(e.target.value)}/>
						</Form.Group>
						<Form.Group controlId="category">
							<Form.Label>Enter Category</Form.Label>
							<Form.Control type='text' placeholder='Enter Category'
							value={category} onChange={e=>setCategory(e.target.value)}/>
						</Form.Group>
						<Form.Group controlId="description">
							<Form.Label>Enter Description</Form.Label>
							<Form.Control type='text' placeholder='Enter Description'
							value={description} onChange={e=>setDescription(e.target.value)}/>
						</Form.Group>
						<Button type='submit' variant='primary'>
							Update
						</Button>
				</Form>
				)}
				
		</FormContainer>
		</React.Fragment>		
	)
}

export default ProductEditScreen;