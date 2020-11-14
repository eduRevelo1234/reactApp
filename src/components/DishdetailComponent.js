import React, { Component, Fragment } from 'react';
import { Card, CardTitle, CardText, CardImg, CardBody, BreadcrumbItem, Breadcrumb, Button, Modal, ModalHeader, ModalBody, Col, Label,Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';   

class CommentForm extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
        isModalOpen: false
        }
    
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    toggleModal() {
        this.setState({
        isModalOpen: !this.state.isModalOpen
        });
    }
    
    handleSubmit(values) {    
        this.toggleModal();
        this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
    }
render(){
    const required = (val) => val && val.length;
    const maxLength = (len) => (val) => !(val) || (val.length <= len);
    const minLength = (len) => (val) => (val) && (val.length >= len);
    return(
        <div>
        <Button outline onClick={this.toggleModal}>
            <span className="fa fa-pencil fa-lg"/> Submit Comment
        </Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
        <ModalHeader toggle={this.toggleModal} >Submit Comment</ModalHeader>
        <ModalBody>
        <LocalForm  onSubmit={(values) => this.handleSubmit (values)}>
            <Row className="form-group" >
                <Col md={{size:10,offset:1}}>
                    <Label  htmlFor="rating" >  Rating</Label>  
                </Col>
            </Row>
            <Row className="form-group" >
                <Col  md={{size:10,offset:1}} >
                <Control.select  model=".rating" id="rating" name="rating"
                        className = "form-control"
                        validators ={{
                            required
                        }}>
                        <option value="1">1</option>    
                        <option value="2">2</option>  
                        <option value="3">3</option>  
                        <option value="4">4</option>  
                        <option value="5">5</option>  
                </Control.select>
                    <Errors 
                        className="text-danger"
                        model=".rating"
                        show="touched"
                        messages={{
                            required: 'Required'
                        }}
                    />
                </Col>    
            </Row>
            <Row className="form-group">
                <Col  md={{size:10,offset:1}} >
                    <Label htmlFor="author">Your Name</Label>
                </Col>
            </Row>
            <Row className="form-group">
                <Col md={{size:10,offset:1}} >
                    <Control.text model=".author" id="author" name="author"
                        placeholder="Your Name"
                        className = "form-control"
                        validators ={{
                            required,minLength: minLength(3), maxLength: maxLength(15)
                        }}
                    />
                    <Errors 
                        className="text-danger"
                        model=".author"
                        show="touched"
                        messages={{
                            required: 'Required',
                            minLength: 'Must be greater than 2 characters',
                            maxLength: 'Must be 15 characters or less'
                        }}
                    />
                </Col>
            </Row>
            <Row className="form-group">
                <Col  md={{size:10,offset:1}}>
                    <Label htmlFor="comment" >Comment</Label>
                </Col>
            </Row>
            <Row className="form-group">
                <Col md={{size:10,offset:1}}>
                    <Control.textarea model=".message" id="message" name="message"
                        rows="6"
                        className="form-control"/>
                </Col>
            </Row>
            <Row className="form-group">
                <Col md={{size:10,offset:1}}>
                    <Button type="submit" color="primary">
                        Submit
                    </Button>
                </Col>
            </Row>
        </LocalForm>
        </ModalBody>
        </Modal>
    </div>
    );
    }
}


function RenderDish({dish}){
    return(
        <Card>
            <CardImg width="100%" src={dish.image} alt={dish.name} />
            <CardBody>
                <CardTitle>{dish.name}</CardTitle>
                <CardText>{dish.description}</CardText>
            </CardBody>
        </Card>
    );
}



    
function RenderComments({comments, addComment, dishId}){
       if(comments != null)
            return (
            <div className="col-12 col-md-5 m-1">
                <h4>Comments</h4>
                    <ul class="list-unstyled">
                        
                        {comments.map((comment) => {
                            return(
                                <li key={comment.id}>
                                <p>{comment.comment}</p>
                                <p>-- {comment.author}, {new Intl.DateTimeFormat('en-US',{year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                                </li>
                            );
                        })}
                    </ul>
                    <CommentForm dishId={dishId} addComment={addComment} />
            </div>
            );
        else 
            return (
                <div>
                </div>
            );
}
   
   
function DishDetail(props){

        if (props.isLoading){
            return(
                <div className = "container">
                    <div className = "row">
                        <Loading/>
                    </div>
                </div>
            );
        }
        else if (props.errMess){
            return(
                <div className = "container">
                    <div className = "row">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if(props.dish != null){
            return (
                <div className="container">
                <div className="row">
                    <Breadcrumb>

                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>                
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish} />
                    </div>
                    <div className="col-12 col-md-5 m-1">
                        <RenderComments comments={props.comments} 
                            addComment={props.addComment}
                            dishId={props.dish.id}/>
                    </div>
                </div>
                </div>
            );   
        }
        else{
            return(
                <div></div>
            );
        }
}
export default DishDetail;