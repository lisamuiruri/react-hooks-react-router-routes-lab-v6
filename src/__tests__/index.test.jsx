import "@testing-library/jest-dom";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import routes from "../routes";

// ✅ Mock fetch globally for all tests
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    // Mock the Movie detail fetch
    if (url.includes("/movie/1")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            title: "Doctor Strange",
            director: "Scott Derrickson",
            actors: ["Benedict Cumberbatch", "Chiwetel Ejiofor"],
            description: "A brilliant neurosurgeon becomes a sorcerer.",
          }),
      });
    }

    // Add additional mock routes if needed here
    return Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ message: "Not Found" }),
    });
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

// ✅ Tests
test('renders the Home component on route "/"', () => {
  const router = createMemoryRouter(routes);
  render(<RouterProvider router={router} />);
  expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
});

test('renders the Actors component on route "/actors"', () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ["/actors"],
  });
  render(<RouterProvider router={router} />);
  expect(screen.getByText(/Actors Page/i)).toBeInTheDocument();
});

test('renders the Directors component on route "/directors"', () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ["/directors"],
  });
  render(<RouterProvider router={router} />);
  expect(screen.getByText(/Directors Page/i)).toBeInTheDocument();
});

test('renders the Movie component on route "/movie/:id"', async () => {
  const id = 1;
  const router = createMemoryRouter(routes, {
    initialEntries: [`/movie/${id}`],
  });
  render(<RouterProvider router={router} />);
  expect(await screen.findByText(/Doctor Strange/i)).toBeInTheDocument();
  expect(screen.getByText(/Scott Derrickson/i)).toBeInTheDocument();
});

test("renders an error page when given a bad URL", () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ["/bad-route"],
  });
  render(<RouterProvider router={router} />);
  expect(
    screen.getByText(/Oops! Looks like something went wrong./i)
  ).toBeInTheDocument();
});
