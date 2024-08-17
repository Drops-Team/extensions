import { ActionPanel, List, Action, showToast, Icon, Clipboard, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import {
  getFavorites,
  addToFavorites,
  removeFromFavoritesForWallets,
  isFavoriteForWallets,
} from "./commands/dropstabWalletsCommands";
import { WalletSearchResult } from "./types/walletType";

const WALLET_FAVORITES_KEY = "walletFavorites";

export default function SearchWalletCommand() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [favorites, setFavorites] = useState<WalletSearchResult[]>([]);
  const [searchResults, setSearchResults] = useState<WalletSearchResult[]>([]);

  useEffect(() => {
    setFavorites(getFavorites(WALLET_FAVORITES_KEY));
  }, []);

  const handleSearchTextChange = (text: string) => {
    setWalletAddress(text);
    // Обновите результаты поиска на основе введенного текста
    const results = getLinks(text).map((link) => ({
      id: text,
      name: text,
      url: link.url,
      icon: link.icon,
      network: link.title,
    }));
    setSearchResults(results);
  };

  const isValidEthereumAddress = (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address);
  const isValidTronAddress = (address: string) => /^T[a-zA-Z0-9]{33}$/.test(address);
  const isValidSolanaAddress = (address: string) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  const isValidBitcoinAddress = (address: string) =>
    /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,39}$/.test(address) || /^(bc1)[a-zA-HJ-NP-Z0-9]{39,59}$/.test(address);

  const getLinks = (address: string) => {
    const etherscanUrl = `https://etherscan.io/address/${address}`;
    const arbiscanUrl = `https://arbiscan.io/address/${address}`;
    const zkscanUrl = `https://explorer.zksync.io/address/${address}`;
    const optimismUrl = `https://optimistic.etherscan.io/address/${address}`;
    const baseUrl = `https://basescan.org/address/${address}`;
    const debankUrl = `https://debank.com/profile/${address}`;
    const bscUrl = `https://bscscan.com/address/${address}`;
    const avaxUrl = `https://snowtrace.io/address/${address}`;
    const maticUrl = `https://polygonscan.com/address/${address}`;
    const ftmUrl = `https://ftmscan.com/address/${address}`;
    const injUrl = `https://explorer.injective.network/account/${address}`;
    const mntUrl = `https://explorer.mantle.xyz/address/${address}`;
    const mantaUrl = `https://manta.socialscan.io/address/${address}`;
    const lineaUrl = `https://explorer.linea.build/address/${address}`;
    const scrollUrl = `https://scrollscan.com/address/${address}`;
    const blastUrl = `https://blastscan.io/address/${address}`;

    const tronscanUrl = `https://tronscan.org/#/address/${address}`;
    const solscanUrl = `https://solscan.io/account/${address}`;
    const btcUrl = `https://www.blockchain.com/btc/address/${address}`;

    const links = [];

    if (isValidEthereumAddress(address)) {
      links.push(
        { title: "View on Etherscan", url: etherscanUrl, icon: "ethereum.png", network: "eth" },
        { title: "View on Debank", url: debankUrl, icon: "debank.png", network: "debank" },
        { title: "View on Arbiscan", url: arbiscanUrl, icon: "arbitrum.png", network: "arb" },
        { title: "View on Zkscan", url: zkscanUrl, icon: "zksync.png", network: "zksync" },
        { title: "View on Optimism", url: optimismUrl, icon: "optimism.png", network: "optimism" },
        { title: "View on Base", url: baseUrl, icon: "base.png", network: "base" },
        { title: "View on BscScan", url: bscUrl, icon: "bsc.png", network: "bsc" },
        { title: "View on Snowtrace", url: avaxUrl, icon: "avax.png", network: "avax" },
        { title: "View on Polygonscan", url: maticUrl, icon: "matic.png", network: "matic" },
        { title: "View on FtmScan", url: ftmUrl, icon: "ftm.png", network: "ftm" },
        { title: "View on Injective", url: injUrl, icon: "inj.png", network: "inj" },
        { title: "View on Mantle", url: mntUrl, icon: "mnt.png", network: "mnt" },
        { title: "View on Manta", url: mantaUrl, icon: "manta.png", network: "manta" },
        { title: "View on Linea", url: lineaUrl, icon: "linea.png", network: "linea" },
        { title: "View on Scroll", url: scrollUrl, icon: "scroll.png", network: "scroll" },
        { title: "View on Blast", url: blastUrl, icon: "blast.png", network: "blast" },
      );
    }
    if (isValidBitcoinAddress(address)) {
      links.push({ title: "View on Blockchain.com", url: btcUrl, icon: "bitcoin.png", network: "btc" });
    }
    if (isValidSolanaAddress(address)) {
      links.push({ title: "View on Solscan", url: solscanUrl, icon: "solana.png", network: "solana" });
    }
    if (isValidTronAddress(address)) {
      links.push({ title: "View on Tronscan", url: tronscanUrl, icon: "tron.png", network: "tron" });
    }
    return links;
  };

  const getFavoriteLink = (favorite: WalletSearchResult) => {
    if (favorite.network === "eth") {
      return { title: "View on Etherscan", url: `https://etherscan.io/address/${favorite.id}`, icon: "ethereum.png" };
    } else if (favorite.network === "debank") {
      return { title: "View on Debank", url: `https://debank.com/profile/${favorite.id}`, icon: "debank.png" };
    } else if (favorite.network === "arb") {
      return { title: "View on Arbiscan", url: `https://arbiscan.io/address/${favorite.id}`, icon: "arbitrum.png" };
    } else if (favorite.network === "zksync") {
      return { title: "View on Zkscan", url: `https://explorer.zksync.io/address/${favorite.id}`, icon: "zksync.png" };
    } else if (favorite.network === "optimism") {
      return {
        title: "View on Optimism",
        url: `https://optimistic.etherscan.io/address/${favorite.id}`,
        icon: "optimism.png",
      };
    } else if (favorite.network === "base") {
      return { title: "View on Base", url: `https://basescan.org/address/${favorite.id}`, icon: "base.png" };
    } else if (favorite.network === "tron") {
      return { title: "View on Tronscan", url: `https://tronscan.org/#/address/${favorite.id}`, icon: "tron.png" };
    } else if (favorite.network === "solana") {
      return { title: "View on Solscan", url: `https://solscan.io/account/${favorite.id}`, icon: "solana.png" };
    } else if (favorite.network === "btc") {
      return {
        title: "View on Blockchain.com",
        url: `https://www.blockchain.com/btc/address/${favorite.id}`,
        icon: "bitcoin.png",
      };
    } else if (favorite.network === "bsc") {
      return { title: "View on BscScan", url: `https://bscscan.com/address/${favorite.id}`, icon: "bsc.png" };
    } else if (favorite.network === "avax") {
      return { title: "View on Snowtrace", url: `https://snowtrace.io/address/${favorite.id}`, icon: "avax.png" };
    } else if (favorite.network === "matic") {
      return { title: "View on Polygonscan", url: `https://polygonscan.com/address/${favorite.id}`, icon: "matic.png" };
    } else if (favorite.network === "ftm") {
      return { title: "View on FtmScan", url: `https://ftmscan.com/address/${favorite.id}`, icon: "ftm.png" };
    } else if (favorite.network === "inj") {
      return {
        title: "View on Injective",
        url: `https://explorer.injective.network/account/${favorite.id}`,
        icon: "inj.png",
      };
    } else if (favorite.network === "mnt") {
      return { title: "View on Mantle", url: `https://explorer.mantle.xyz/address/${favorite.id}`, icon: "mnt.png" };
    } else if (favorite.network === "manta") {
      return { title: "View on Manta", url: `https://manta.socialscan.io/address/${favorite.id}`, icon: "manta.png" };
    } else if (favorite.network === "linea") {
      return { title: "View on Linea", url: `https://explorer.linea.build/address/${favorite.id}`, icon: "linea.png" };
    } else if (favorite.network === "scroll") {
      return { title: "View on Scroll", url: `https://scrollscan.com/address/${favorite.id}`, icon: "scroll.png" };
    } else if (favorite.network === "blast") {
      return { title: "View on Blast", url: `https://blastscan.io/address/${favorite.id}`, icon: "blast.png" };
    } else {
      return { title: "Unknown Network", url: "#", icon: "unknown.png" };
    }
  };

  const handleAddToFavorites = (link: WalletSearchResult) => {
    const newFavorite: WalletSearchResult = {
      id: link.id,
      name: link.name,
      network: link.network,
      icon: link.icon,
      url: link.url,
    };
    addToFavorites(newFavorite, favorites, setFavorites, WALLET_FAVORITES_KEY);
  };

  const handleRemoveFromFavorites = (favorite: WalletSearchResult) => {
    removeFromFavoritesForWallets(favorite, favorites, setFavorites, WALLET_FAVORITES_KEY);
  };

  return (
    <List onSearchTextChange={handleSearchTextChange} searchBarPlaceholder="Enter wallet address..." throttle>
      {!walletAddress && favorites.length > 0 && (
        <List.Section title="Favorites">
          {favorites.map((favorite) => {
            const link = getFavoriteLink(favorite);
            return (
              <List.Item
                key={`${favorite.id}-${favorite.network}`}
                icon={link.icon}
                title={favorite.name}
                accessories={[{ text: `View on ${link.title.split(" ")[2]}` }]}
                actions={
                  <ActionPanel>
                    <Action.OpenInBrowser title={link.title} url={link.url} />
                    <ActionPanel.Item
                      title="Remove from Favorites"
                      onAction={() => handleRemoveFromFavorites(favorite)}
                      icon={Icon.Star}
                    />
                    <ActionPanel.Item
                      title="Copy Address"
                      onAction={() => Clipboard.copy(favorite.id)}
                      icon={Icon.Clipboard}
                    />
                  </ActionPanel>
                }
              />
            );
          })}
        </List.Section>
      )}
      <List.Section title="Search Results">
        {walletAddress && searchResults.length > 0
          ? searchResults.map((link) => (
              <List.Item
                key={link.url}
                icon={link.icon}
                title={walletAddress}
                accessories={[{ text: `${link.network}` }]}
                actions={
                  <ActionPanel>
                    <Action.OpenInBrowser title={link.name} url={link.url} />
                    {isFavoriteForWallets(link, favorites) ? (
                      <Action
                        title="Remove from Favorites"
                        onAction={() => handleRemoveFromFavorites(link)}
                        icon={Icon.Star}
                      />
                    ) : (
                      <Action title="Add to Favorites" onAction={() => handleAddToFavorites(link)} icon={Icon.Star} />
                    )}
                    <ActionPanel.Item
                      title="Copy Address"
                      onAction={() => Clipboard.copy(walletAddress)}
                      icon={Icon.Clipboard}
                    />
                  </ActionPanel>
                }
              />
            ))
          : walletAddress && (
              <List.Item
                title="Invalid Wallet Address"
                actions={
                  <ActionPanel>
                    <Action
                      title="Show Error"
                      onAction={() => showToast(Toast.Style.Failure, "Invalid Wallet Address")}
                    />
                  </ActionPanel>
                }
              />
            )}
      </List.Section>
    </List>
  );
}
