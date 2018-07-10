import React, { Component } from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';


class ImagesUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uploading: false
        };
        this.handleUpload = this.handleUpload.bind(this);
    }


    async handleUpload(ev) {
        ev.preventDefault();

        const data = new FormData();
        for (let i = 0; i < this.uploadInput.files.length; i++){
            data.append('photos', this.uploadInput.files[i]);
        }
        this.setState({
            uploading: true
        });
        try {
            const response = await axios.post('http://localhost:3000/api/upload', data);

        } catch (err){
            console.log(err);
        } finally {
            this.setState({
                uploading: false
            });
        }
    }


    render() {
        return(
            this.state.uploading ?
                <div style={{height: '100%', width: '100%', textAlign: 'center'}}>
                    <div style={{display: 'inline-block', position: 'relative', top: '25%' }}>
                        <ReactLoading type="spin" color="#fff" height={200} width={200} />
                    </div>
                </div> :
            <div className="container">
                <form onSubmit={this.handleUpload} >
                    <div className="form-group">
                        <input ref={(ref) => { this.uploadInput = ref; }} className="form-control"  type="file" name="photos" multiple />
                    </div>
                    <input type="submit" value="upload" />
                </form>
            </div>
        )
    }
}

export default ImagesUpload
