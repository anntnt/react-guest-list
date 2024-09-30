import { useEffect, useState } from 'react';
import styles from './Form.module.css';

const baseUrl = 'https://qzk324-4000.csb.app';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAllGuests() {
      const response = await fetch(`${baseUrl}/guests`, {
        method: 'GET',
      });
      const allGuests = await response.json();
      setGuests(allGuests);
      // set Timer to see the text "Loading..."
      //  const timer = setTimeout(() => {
      setIsLoading(false);
      // }, 100);
      // return () => clearTimeout(timer);
    }
    getAllGuests().catch((error) => {
      console.log(error);
    });
  });

  async function createNewGuest(fName, lName) {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: fName,
        lastName: lName,
      }),
    });
    await response.json();
  }

  async function updateGuest(id, attending) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: attending }),
    });
    await response.json();
  }
  async function deleteGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    await response.json();
  }
  return (
    <div className={styles.formWrapper}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className={styles.guestInput}>
          <div className={styles.inputGroup}>
            <label htmlFor="firstName">First name: </label>
            <input
              value={firstName}
              id="firstName"
              onChange={(event) => {
                setFirstName(event.currentTarget.value);
              }}
              disabled={isLoading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="lastName">Last name: </label>
            <input
              value={lastName}
              id="lastName"
              disabled={isLoading}
              onChange={(event) => {
                setLastName(event.currentTarget.value);
              }}
              onKeyDown={async (event) => {
                if ((event.currentTarget.value && event.key) === 'Enter') {
                  console.log(guests);
                  console.log('guests.length' + guests.length);
                  const tmpGuestId =
                    guests.length === 0
                      ? 0
                      : parseInt(guests[guests.length - 1].id) + 1;
                  const tmpNewGuest = {
                    id: tmpGuestId,
                    firstName: firstName,
                    lastName: lastName,
                    attending: false,
                  };
                  setGuests([...guests, tmpNewGuest]);
                  await createNewGuest(firstName, lastName);
                  setFirstName('');
                  setLastName('');
                }
              }}
            />
          </div>
        </div>

        <div>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {guests.map((guest, index) => {
                console.log(`guest: guest`);
                return (
                  <div
                    key={`guest-${guest.id}`}
                    className={styles.guest}
                    data-test-id="guest"
                  >
                    <input
                      type="checkbox"
                      aria-label={
                        guest.attending
                          ? `${guest.firstName} ${guest.lastName} true`
                          : `${guest.firstName} ${guest.lastName} false`
                      }
                      checked={guest.attending}
                      onChange={async () => {
                        const newGuests = [...guests];
                        if (newGuests[index].attending) {
                          newGuests[index].attending = false;
                        } else {
                          newGuests[index].attending = true;
                        }
                        setGuests(newGuests);
                        await updateGuest(
                          newGuests[index].id,
                          newGuests[index].attending,
                        );
                      }}
                    />
                    <div>{guest.firstName}</div>
                    <div>{guest.lastName}</div>
                    <button
                      aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                      onClick={async () => {
                        const newGuests = [...guests];
                        newGuests.splice(index, 1);
                        await deleteGuest(guest.id);
                        setGuests(newGuests);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
