import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  text-align: center;`
;

const Button = styled.button`
  background-color: #1db954;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
;`

export default function LoginPage({ loginWithSpotify, token }) {
  return (
    <Container>
      <h1>Login with Spotify</h1>
      {!token && <Button onClick={loginWithSpotify}>Login</Button>}
    </Container>
  );
}