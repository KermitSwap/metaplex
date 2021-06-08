import React, { useMemo } from 'react';
import './index.less';
import { Link } from 'react-router-dom';
import { Button, Dropdown, Menu } from 'antd';
import { ConnectButton, CurrentUserBadge, useWallet,useConnection } from '@oyster/common';
import { Notifications } from '../Notifications';
import useWindowDimensions from '../../utils/layout';
import { MenuOutlined } from '@ant-design/icons';
import { useMeta } from '../../contexts';
import { saveAdmin } from '../../actions/saveAdmin';

const UserActions = () => {
  const { wallet } = useWallet();
  const connection=useConnection();
  const { whitelistedCreatorsByCreator, store } = useMeta();
  const pubkey = wallet?.publicKey?.toBase58() || '';

  const canCreate = useMemo(() => {
    return store &&
      store.info &&
      (store.info.public ||
        whitelistedCreatorsByCreator[pubkey]?.info
          ?.activated);
  }, [pubkey, whitelistedCreatorsByCreator, store]);

  return (
    <>
      {/* <Link to={`#`}>
        <Button className="app-btn">Bids</Button>
      </Link> */}
      {canCreate && (<Link to={`/art/create`}>
        <Button className="app-btn">Create</Button>
      </Link>)}
      <Link to={`/auction/create/0`}>
        <Button className="connector" type="primary" >Sell</Button>
      </Link>
      <Button onClick={()=>{
        saveAdmin(connection,wallet,false,[])
      }}>Make admin</Button>
      </>
  );
};

const DefaultActions = ({ vertical = false }: { vertical?: boolean }) => {
  const { connected } = useWallet();
  return (
    <div style={{
      display: "flex",
      flexDirection: vertical ? "column" : "row",
    }}>
      <Link to={`/`}>
        <Button className="app-btn">Explore</Button>
      </Link>
      <Link to={`/artworks`}>
        <Button className="app-btn">{connected ? "My Items" : "Artworks"}</Button>
      </Link>
      <Link to={`/artists`}>
        <Button className="app-btn">Creators</Button>
      </Link>
    </div>
  )
}

const MetaplexMenu = () => {
  const { width } = useWindowDimensions();
  const { connected } = useWallet();

  if (width < 768) return <>
    <Dropdown
      arrow
      placement="bottomLeft"
      trigger={['click']}
      overlay={<Menu>
        <Menu.Item>
          <Link to={`/`}>
            <Button className="app-btn">Explore</Button>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={`/artworks`}>
            <Button className="app-btn">{connected ? "My Items" : "Artworks"}</Button>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={`/artists`}>
            <Button className="app-btn">Creators</Button>
          </Link>
        </Menu.Item>
      </Menu>}
    >
      <MenuOutlined style={{ fontSize: "1.4rem" }} />
    </Dropdown>
  </>

  return <DefaultActions />
}

export const AppBar = () => {
  const { connected } = useWallet();

  return (
    <>
      <div className="app-left app-bar-box">
        <Notifications />
        <div className="divider" />
        <MetaplexMenu />
      </div>
      {!connected && <ConnectButton type="primary" />}
      {connected && (
        <div className="app-right app-bar-box">
          <UserActions />
          <CurrentUserBadge
            showBalance={false}
            showAddress={false}
            iconSize={24}
          />
        </div>
      )}
    </>
  );
};
