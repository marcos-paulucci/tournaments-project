import React, {Component} from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const SortableItem = SortableElement(({player}) =>
    <li><span>{player ? player.name : ''}</span>  <span>Posicion en el top: {player.index + 1}</span></li>
);

const SortableList = SortableContainer(({items}) => {
    return (
        <ul>
            {items.map(function(player, index) {
                player.index = index;
                return <SortableItem key={`item-${index}`} index={index} player={player} />;
            })}
        </ul>
    );
});

class TopPlayers extends Component {
    state = {
        items: this.props.players,
    };
    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState({
            items: arrayMove(this.state.items, oldIndex, newIndex),
        });
    };

    selectPlayersTournament = () => {
        this.props.sendTopPlayersToServer(this.state.items);
    };
    render() {
        return <div>
            <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />
            <input type="button" value="Enviar nuevo orden al servidor!" onClick={this.selectPlayersTournament.bind(this)} />
        </div>;
    }
}

export default TopPlayers;