import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FilterSheet from "./FilterSheet";

const mockOnApplyFilter = vi.fn();

const renderFilterSheet = (props = {}) =>
  render(
    <FilterSheet onApplyFilter={mockOnApplyFilter} {...props}>
      <button>Open Filter</button>
    </FilterSheet>
  );

const openSheet = () => fireEvent.click(screen.getByText("Open Filter"));

describe("FilterSheet", () => {
  beforeEach(() => {
    mockOnApplyFilter.mockClear();
  });

  it("renders the trigger children", () => {
    renderFilterSheet();
    expect(screen.getByText("Open Filter")).toBeInTheDocument();
  });

  it("opens the sheet when trigger is clicked", () => {
    renderFilterSheet();
    openSheet();
    expect(screen.getByText("Sort Products")).toBeInTheDocument();
  });

  it("shows Sort By and Order sections", () => {
    renderFilterSheet();
    openSheet();
    expect(screen.getByText("Sort by")).toBeInTheDocument();
    expect(screen.getByText("Order")).toBeInTheDocument();
  });

  it("defaults to created_at and desc", () => {
    renderFilterSheet();
    openSheet();
    expect(screen.getByLabelText("Date Added")).toBeChecked();
    expect(screen.getByLabelText("Newest First")).toBeChecked();
  });

  it("respects currentSortBy and currentSortOrder props", () => {
    renderFilterSheet({ currentSortBy: "price", currentSortOrder: "asc" });
    openSheet();
    expect(screen.getByLabelText("Price")).toBeChecked();
    expect(screen.getByLabelText("Low to High")).toBeChecked();
  });

  it("calls onApplyFilter with selected values when Apply is clicked", () => {
    renderFilterSheet();
    openSheet();
    fireEvent.click(screen.getByLabelText("Price"));
    fireEvent.click(screen.getByText("Apply Filter"));
    expect(mockOnApplyFilter).toHaveBeenCalledWith("price", "desc");
  });

  it("calls onApplyFilter with both changed values", () => {
    renderFilterSheet();
    openSheet();
    fireEvent.click(screen.getByLabelText("Price"));
    fireEvent.click(screen.getByLabelText("Low to High"));
    fireEvent.click(screen.getByText("Apply Filter"));
    expect(mockOnApplyFilter).toHaveBeenCalledWith("price", "asc");
  });

  it("shows price-specific order labels when price is selected", () => {
    renderFilterSheet({ currentSortBy: "price" });
    openSheet();
    expect(screen.getByText("High to Low")).toBeInTheDocument();
    expect(screen.getByText("Low to High")).toBeInTheDocument();
  });

  it("shows date-specific order labels when created_at is selected", () => {
    renderFilterSheet({ currentSortBy: "created_at" });
    openSheet();
    expect(screen.getByText("Newest First")).toBeInTheDocument();
    expect(screen.getByText("Oldest First")).toBeInTheDocument();
  });

  it("switches order labels when sort by changes", () => {
    renderFilterSheet();
    openSheet();
    expect(screen.getByText("Newest First")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Price"));
    expect(screen.getByText("High to Low")).toBeInTheDocument();
  });

  it("closes sheet and calls onApplyFilter when Apply is clicked", () => {
    renderFilterSheet();
    openSheet();
    fireEvent.click(screen.getByText("Apply Filter"));
    expect(mockOnApplyFilter).toHaveBeenCalledOnce();
    expect(screen.queryByText("Sort Products")).not.toBeInTheDocument();
  });
});
