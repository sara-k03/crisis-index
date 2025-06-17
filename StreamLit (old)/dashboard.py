import streamlit as st
import dashboard_controller as dc

# Show filters once
df = dc.load_UCDP_v25_data()

conflict_types = {
    "Interstate (e.g., India-Pakistan)": 3,
    "Civil War (Intrastate)": 4,
    "Internationalized Civil War": 5
}

selected_types = st.multiselect(
    "Select Conflict Types:",
    options=list(conflict_types.keys()),
    default=list(conflict_types.keys()),
    key="conflict_types_selector"
)

selected_codes = [conflict_types[t] for t in selected_types]
filtered_df = df[df["type_of_conflict"].isin(selected_codes)]

min_year, max_year = int(df["year"].min()), int(df["year"].max())

# Country selector (like other filters)
countries = sorted(filtered_df["location"].unique())
selected_country = st.selectbox(
    "Select Country:",
    options=countries,
    key="country_selector"
)

year_range = st.slider(
    "Year Range",
    min_year,
    max_year,
    (1946, 2024),
    key="year_range_slider"
)

year_filtered_df = filtered_df[(filtered_df["year"] >= year_range[0]) & (filtered_df["year"] <= year_range[1])]

country_filtered_df = filtered_df[filtered_df["location"] == selected_country]

dc.generate_map(country_filtered_df)
dc.search_conflict_by_country(filtered_df, selected_country)
# dc.search_by_actor(country_filtered_df)
dc.generate_lineplot(country_filtered_df, "Number of Conflicts in " + selected_country)
