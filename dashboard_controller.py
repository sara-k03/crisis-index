import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import folium
from streamlit_folium import folium_static
import json

"""
Javadoc comments
"""
def set_page(title, layout="wide"):
    st.set_page_config(layout=layout)
    st.title(title)

"""
Javadoc comments
"""
@st.cache_data
def load_UCDP_v25_data():
    df = pd.read_csv("UcdpPrioConflict_v25_1.csv")
    df["year"] = pd.to_numeric(df["year"], errors="coerce")

    # Fill missing side_b with "Unknown" or empty string
    df["side_b"] = df["side_b"].fillna("Unknown")
    df["incompatibility"] = df["incompatibility"].fillna("Unknown issue")

    # Generate conflict name dynamically
    df["conflict_name"] = (
        df["side_a"].astype(str) + " vs " +
        df["side_b"].astype(str) + " (" +
        df["incompatibility"].astype(str) + ")"
    )

    return df


"""
Javadoc comments
"""
def generate_lineplot(filtered_df, title):

    st.subheader(title)
    conflict_by_year = filtered_df.groupby("year")["conflict_id"].nunique()
    fig, ax = plt.subplots(figsize=(14, 6))
    conflict_by_year.plot(kind="line", marker='o', ax=ax)
    plt.xlabel("Year")
    plt.ylabel("Unique Conflicts")
    plt.grid(True)
    st.pyplot(fig, use_container_width=True)

"""
Javadoc comments
"""
def generate_map(filtered_df):

    st.subheader("Map of Conflicts by Country")

    conflict_by_country = (
        filtered_df.groupby("location")["conflict_id"]
        .nunique()
        .reset_index()
        .rename(columns={"location": "country", "conflict_id": "num_conflicts"})
    )

    world_map = folium.Map(location=[20, 0], zoom_start=2)

    # world-countries.json link: https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/world-countries.json 
    with open("world-countries.json", "r", encoding="utf-8") as f:
        geojson_data = json.load(f)

    folium.Choropleth(
        geo_data=geojson_data,
        name="choropleth",
        data=conflict_by_country,
        columns=["country", "num_conflicts"],
        key_on="feature.properties.name",
        fill_color="YlOrRd",
        fill_opacity=0.7,
        line_opacity=0.2,
        legend_name="Unique Conflicts by Country"
    ).add_to(world_map)

    folium_static(world_map, width=1400, height=600)

"""
Javadoc comments
"""
def search_conflict_by_country(filtered_df, selected_country):

    # Filter data
    country_conflicts = filtered_df[filtered_df["location"] == selected_country]

    # Years
    years = sorted(country_conflicts["year"].unique())
    st.markdown(f"**Years of Conflict:** {', '.join(map(str, years))}")

    # Conflict types
    type_map = {3: "Interstate", 4: "Civil War", 5: "Internationalized Civil War"}
    types = country_conflicts["type_of_conflict"].map(type_map).unique()
    st.markdown(f"**Conflict Types:** {', '.join(types)}")

    # Names + IDs
    st.markdown("**Conflicts:**")
    grouped = (
        country_conflicts.groupby(["conflict_id", "conflict_name"])["year"]
        .apply(lambda years: sorted(set(years)))
        .reset_index()
    )

    for _, row in grouped.iterrows():
        years_str = ", ".join(map(str, row["year"]))
        st.markdown(f"- {row['conflict_name']} ({years_str})")

"""
Javadoc comments
"""
def search_by_actor(filtered_df):

    actor_query = st.text_input(
        "Explore Conflict Details by Actor",
        key="actor_text_input"
    )

    if actor_query:
        actor_filtered_df = filtered_df[
            filtered_df["side_a"].str.contains(actor_query, case=False, na=False) |
            filtered_df["side_b"].str.contains(actor_query, case=False, na=False)
        ]

        st.subheader(f"Conflicts involving: {actor_query}")

        years = sorted(actor_filtered_df["year"].unique())
        st.markdown(f"**Years of Involvement:** {', '.join(map(str, years))}")

        type_map = {3: "Interstate", 4: "Civil War", 5: "Internationalized Civil War"}
        types = actor_filtered_df["type_of_conflict"].map(type_map).dropna().unique()
        st.markdown(f"**Conflict Types:** {', '.join(types)}")

        st.markdown("**Conflicts:**")
        for _, row in (
            actor_filtered_df[["conflict_name", "conflict_id", "year"]]
            .drop_duplicates()
            .sort_values(by="year")
            .iterrows()
        ):
            st.markdown(f"- {row['conflict_name']} ({row['year']})")

