import { Button, Card, CardActionArea, CardActions, CardContent, Grid, Typography } from "@mui/material";
import { Book } from "../types";
import { Link } from "react-router-dom";

const BookList = ({ books }: { books: Book[] }) => {
    return (
        <div data-test='book-list'>
            <Grid container spacing={3}>
                {books.map(book => (
                    <Grid item xs={4} sm={4} key={book.id} className="book-item">
                        <Card>
                            <CardActionArea>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {book.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {book.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small" color="primary">
                                    <Link to={`/books/${book.id}`}>View Details</Link>
                                </Button>
                            </CardActions>
                        </Card>                                                
                    </Grid>
                ))}
            </Grid>        
        </div>
    );
};

export default BookList;
