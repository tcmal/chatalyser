import React from 'react';

import DataDisplay from './DataDisplay';

export default class App extends React.Component {
    constructor() {
        super();

        this.state = {
            url: "",
            data: null,
            error: null,
            loading: false,
        };
    }

    formSubmit = (e) => {
        e.preventDefault();
        const { url } = this.state;

        // Get video id from Url
        if (!url.startsWith('https://www.twitch.tv/videos/')) {
            this.setState({
                ...this.state,
                error: "Invalid URL"
            });
            return;
        }

        const videoId = url.split("https://www.twitch.tv/videos/")[1];
        try {
            parseInt(videoId);
        } catch (_) {
            this.setState({
                ...this.state,
                error: "Invalid URL"
            });
            return;
        }

        // Start fetching data
        fetch('/chatByMinute/' + videoId).then(x => x.json())
            .then(data => {
                if (data.success) {
                    console.log(data);
                    this.setState({
                        ...this.state,
                        loading: false,
                        data
                    });
                } else {
                    this.setState({
                        ...this.state,
                        loading: false,
                        error: data.error
                    });
                }
            })
            .catch(err => {
                this.setState({
                    ...this.state,
                    loading: false,
                    error: err.toString()
                })
            });

        this.setState({
            ...this.state,
            loading: true
        });
    }

    render() {
        const { url, data, error, loading } = this.state;

        if (loading) {
            return (
                <div>
                    <h1>Loading...</h1>
                </div>
            )
        }

        if (data) {
            return (
                <DataDisplay data={data} />
            );
        }

        return (
            <main>
                <h1>Chatalyser</h1>
                <p>Enter the URL for a twitch vod to see how nice/toxic the chat is throughout it.</p>
                <form onSubmit={this.formSubmit} className={error ? 'error' : ''}>
                    <input className="form-url" type="text" placeholder="URL" value={url} onChange={e => this.setState({
                        ...this.state,
                        url: e.target.value
                    })}/>
                    <div className="form-submit">
                      <input type="submit" value="Submit" className="btn" />
                    </div>
                </form>
                {error ? <p className="error-message">{error}</p> : ''}
            </main>
        );
    }
}