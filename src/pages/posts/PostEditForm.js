import React, { useRef, useState, useEffect } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import { Image } from "react-bootstrap";
import { Alert } from "react-bootstrap";


import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useHistory } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { useParams } from "react-router-dom";

function PostEditForm() {
    const [errors, setErrors] = useState({});
    const [postData, setPostData] = useState({
        title: "",
        content: "",
        image: "",
    });

    const { title, content, image } = postData;

    const imageInput = useRef(null);
    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        const handleMount = async () => {
            try {
                const { data } = await axiosReq.get(`/posts/${id}/`);
                const { title, content, image, is_owner } = data;

                is_owner
                    ? setPostData({ title, content, image })
                    : history.push("/");
            } catch (err) {
                // console.log(err);
            }
        };

        handleMount();
    }, [history, id]);

    const handleChange = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value,
        });
    };

    // Create the image file on change
    const handleChangeImage = (e) => {
        if (e.target.files.length) {
            // to clear old image if user chooses a new one
            URL.revokeObjectURL(image);
            setPostData({
                ...postData,
                image: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // https://developer.mozilla.org/en-US/docs/Web/API/FormData
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);

        // following code is there so that if user edits page but does not
        // update image, then the old one is not updated in API
        if (imageInput?.current?.files[0]) {
            formData.append("image", imageInput.current.files[0]);
        }

        try {
            await axiosReq.put(`/posts/${id}/`, formData);
            history.push(`/posts/${id}`);
        } catch (err) {
            // console.log(err);
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            }
        }
    };

    const textFields = (
        <div className="text-center">
            <Form>
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={title}
                        onChange={handleChange}
                    />
                </Form.Group>
                {errors?.title?.map((message, idx) => (
                    <Alert variant="warning" key={idx}>
                        {message}
                    </Alert>
                ))}
                <Form.Group controlId="content">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={6}
                        name="content"
                        value={content}
                        onChange={handleChange}
                    />
                </Form.Group>
                {errors?.content?.map((message, idx) => (
                    <Alert variant="warning" key={idx}>
                        {message}
                    </Alert>
                ))}
            </Form>

            <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                // use goBack method to return to previous page
                onClick={() => {
                    history.goBack();
                }}
            >
                cancel
            </Button>
            <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                type="submit"
            >
                save
            </Button>
        </div>
    );

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                    <Container
                        className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
                    >
                        <Form.Group className="text-center">
                            <figure>
                                <Image
                                    className={appStyles.Image}
                                    src={image}
                                    rounded
                                />
                            </figure>
                            <div>
                                <Form.Label
                                    className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                                    htmlFor="image-upload"
                                >
                                    Change the image
                                </Form.Label>
                            </div>

                            <Form.File
                                id="image-upload"
                                accept="image/*"
                                onChange={handleChangeImage}
                                ref={imageInput}
                            />
                        </Form.Group>
                        {errors?.image?.map((message, idx) => (
                            <Alert variant="warning" key={idx}>
                                {message}
                            </Alert>
                        ))}
                        <div className="d-md-none">{textFields}</div>
                    </Container>
                </Col>
                <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
                    <Container className={appStyles.Content}>
                        {textFields}
                    </Container>
                </Col>
            </Row>
        </Form>
    );
}

export default PostEditForm;
