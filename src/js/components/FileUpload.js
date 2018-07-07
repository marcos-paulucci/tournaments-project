import React, { Component } from 'react';
import axios from 'axios';

class FileUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uploadStatus: false
        };
        this.handleUpload = this.handleUpload.bind(this);
    }


    handleUpload(ev) {
        ev.preventDefault();

        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        data.append('filename', this.fileName.value);

        axios.post('http://localhost:3000/api/upload', data)
            .then(function (response) {
                this.setState({ imageURL: `http://localhost:3000/${response.body.file}`, uploadStatus: true });
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    render() {
        return(
            <div className="container">
                <form onSubmit={this.handleUpload}>
                    <div className="form-group">
                        <input className="form-control"  ref={(ref) => { this.uploadInput = ref; }} type="file" />
                    </div>

                    <div className="form-group">
                        <input className="form-control" ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Optional name for the file" />
                    </div>

                    <button className="btn btn-success" type>Upload</button>

                </form>
            </div>
        )
    }
}

export default FileUpload
