import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

import groupHelpers from './utils/groupHelpers';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { deepOrange500, indigo50, indigo900, indigo700, indigo400, indigo300, cyanA100 } from 'material-ui/styles/colors';


const muiTheme = getMuiTheme({
    palette: {
        accent1Color: deepOrange500,
    },
    flatButton: {
        color: indigo300,
        buttonFilterColor: indigo900
    },

});


class GroupCards extends Component {

    render() {

        let groupToggle = this.props.groups.length;
        console.log(groupToggle);
        let display;
        if (groupToggle === 0) {
            display = (
                <Card style={{ marginTop: '30px' }}>
                    <CardHeader title='Join a Group!'/>
                </Card>
            );
        } else {
            display = (
                <div className="col-sm-7">
                    {this.props.groups.map((group, i) => {

                        return (

                            <Card key={i} style={{ marginTop: '30px' }}>
                                <CardHeader
                                    title={group.name}
                                    titleStyle={{ fontSize: '22px' }}
                                />
                                <CardActions>
                                    <FlatButton label="Open Discussions" />
                                    <FlatButton label="Action2" />
                                </CardActions>
                            </Card>
                        );
                    })}
                </div>
            );
        }

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div className="container">
                    <div className="row">

                        {/* Render filler text or search results if user has submitted a search */}
                        {display}
                    </div>
                </div>
            </MuiThemeProvider>


        );
    }
}

export default GroupCards
