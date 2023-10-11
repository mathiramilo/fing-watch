use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Item {
    #[serde(rename = "ItemId")]
    pub id: String,
    #[serde(rename = "IsHidden")]
    pub hidden: bool,
    #[serde(rename = "Categories")]
    pub categories: Vec<String>,
    #[serde(rename = "Timestamp")]
    pub timestamp: String,
    #[serde(rename = "Labels")]
    pub labels: Vec<String>,
    #[serde(rename = "Comment")]
    pub comment: String,
}
