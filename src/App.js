import { useState } from 'react';
const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className='button' onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  // state to hide or show the FormAddFriend
  const [showAddFriend, setShowAddFriend] = useState(false);
  // setting the default state for friends displayed
  const [friends, setFriends] = useState(initialFriends);
  // state for FormSplitBill
  const [selectedFriend, setSelectedFriend] = useState(null);

  // function to show the hidden FormAddFriend
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }
  // function to add new freind
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    // remove the FormAddFriend box
    setShowAddFriend(false);
  }

  // to display selected friend based what was clicked
  function handleSelection(friend) {
    // setSelectedFriend(friend);
    // set the selectedFriend back to null to close the open FormSplitBill
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  // function to calculate the bills according the value entered
  function handleSplitBill(value) {
    // console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    // remove the FormSplitBill after submitting
    setSelectedFriend(null);
  }
  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />
        {/* this setup was to either show or hide the content  */}
        {/* passing handleAddFriend function as a prop to onAddFriend */}
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {/* if the state is true show 'close' or if it false show 'Add friend' */}
          {showAddFriend ? 'close' : 'Add friend'}
        </Button>
      </div>
      {/* first part of the code make this FormSplitBill display null by default */}
      {/* second part makes the name of the object select get displayed */}
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  // const friends = initialFriends;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  // if selectedfriend is equal the current friend
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className='red'>
          You owe {friend.name} {Math.abs(friend.balance)}
          {/* Math.abs helps to remove the negative value */}
        </p>
      )}
      {friend.balance > 0 && (
        <p className='green'>
          {friend.name} owes you {Math.abs(friend.balance)}
          {/* Math.abs helps to remove the negative value */}
        </p>
      )}
      {friend.balance === 0 && (
        <p>
          You and {friend.name} are even
          {/* Math.abs helps to remove the negative value */}
        </p>
      )}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? 'Close' : 'Select'}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  // state for the form
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  // function for form submition
  function handleSubmit(e) {
    e.preventDefault();
    // if there is no name or image dont submit anything
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    // calling function to add friend
    onAddFriend(newFriend);
    // set state back to default
    setName('');
    setImage('https://i.pravatar.cc/48');
  }
  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Image Url</label>
      <input
        type='text'
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  // friends expenses or paidByFriend  = if bill is  present minus what user paid
  const paidByFriend = bill ? bill - paidByUser : '';
  const [whoIsPaying, setWhoIsPaying] = useState('user');

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    // if the user is paying then the friend is minus else if friend is paying then user is minus
    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser);
  }
  return (
    <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>Bill value</label>
      <input
        type='text'
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>Your expense</label>
      <input
        type='text'
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            // if the value inputed is greater than the the bill show the last data inputed
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label>{selectedFriend.name} expense</label>
      <input type='text' disabled value={paidByFriend} />
      <label>who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value='user'>You</option>
        <option value='friend'>{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
