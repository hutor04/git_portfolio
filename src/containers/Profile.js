import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import List from '../components/List/List';
import Link from '../components/Link/Link';

const ProfileWrapper = styled.div`
  width: 50%;
  margin: 10px auto;
  `;

const Avatar = styled.img`
  width: 150px;
  `;

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState({});
  const [items, setItems] = useState([]);
  const [repositories, setRepositories] = useState([]);

  useEffect( () => {
    const fetchData = async () => {
      try {
        const profile = await fetch('https://api.github.com/users/hutor04');
        const profileJSON = await profile.json();
        const repositories = await fetch(profileJSON.repos_url);
        const repositoriesJSON = await repositories.json();
        setLoading(false);
        setError(false);
        setData(profileJSON);
        setRepositories(repositoriesJSON);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    if (loading) {
      fetchData();
    }
  });

  useEffect(() => {
    setItems([
      { label: 'Prifile on Github', value: <Link url={data.html_url} title='Github URL' /> },
      { label: 'name', value: data.name},
      { label: 'location', value: data.location },
    ]);
  }, [data]);

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error...</div>
  }

  const projects = repositories.map(repository => ({
    label: repository.name,
    value: <Link url={repository.html_url} title='Github URL' />
  }));

  return (
    <ProfileWrapper>
      <Avatar src={data.avatar_url} alt={'Avatar'} />
      <List title='Profile' items={items} />
      <List title='Projects' items={projects} />
    </ProfileWrapper>
  );
};

export default Profile;
