import React         from 'react';
import Reflux        from 'reflux';
import PanelsStore   from './../../stores/PanelsStore';
import PanelsActions from './../../actions/PanelsActions';
import ItemInfo      from './../ItemInfo.jsx';

export default React.createClass({
    displayName: 'InfoPanel',

    mixins: [
        Reflux.ListenerMixin
    ],

    getInitialState() {
        return {
            opened: PanelsStore.get('info')
        };
    },

    componentWillMount() {
        this.listenTo(PanelsStore, this.onPanelsStoreUpdate);
    },

    onPanelsStoreUpdate(type, opened) {
        if (type !== 'info') {
            return;
        }

        this.setState({ opened: opened });
    },

    onOpenClick() {
        PanelsActions.open('info');
    },

    onCloseClick() {
        PanelsActions.close('info');
    },

    render() {
        var classes = 'panel panel--right';
        if (this.state.opened === true) {
            classes += ' _is-opened';
        }

        return (
            <div>
                <div className="panel__open panel__open--right" onClick={this.onOpenClick}>
                    <i className="fa fa-info"/>
                </div>
                <div className={classes}>
                    <div className="panel__close panel__close--right" onClick={this.onCloseClick}>
                        <i className="fa fa-times"/>
                    </div>
                    <ItemInfo/>
                </div>
            </div>
        );
    }
});
