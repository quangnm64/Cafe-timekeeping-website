'use client';
import React, { useEffect, useState } from 'react';

function GetCurrentAddress() {
  const [add, setAdd] = useState('');

  // https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log(
            data.address.city +
              ' ' +
              data.address.road +
              ' ' +
              data.address.state
          );
        });
    });
  }, []);

  return (
    <>
      <p>road : {add}</p>
    </>
  );
}

export default GetCurrentAddress;
