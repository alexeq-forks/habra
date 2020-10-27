import * as React from 'react'
import { useState, useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router'
import { getPost } from '../../api'
import { Link } from 'react-router-dom'
import PostViewSkeleton from '../../components/skeletons/PostView'
import ErrorComponent from '../../components/blocks/Error'
import moment from 'moment'
import FormattedText from '../../components/formatters/FormattedText'
import { Theme } from '@material-ui/core/styles'
import { Post as IPost } from 'src/interfaces'
import UserAvatar from 'src/components/blocks/UserAvatar'
import BottomBar from './BottomBar'
import CommentsButton from './CommentsButton'
import SimilarPosts from './SimilarPosts'
import TopDayPosts from './TopDayPosts'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    maxWidth: '100vw',
    backgroundColor: theme.palette.background.default,
  },
  hubs: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    wordBreak: 'break-word',
    width: '100%',
    background: theme.palette.background.default,
  },
  hubLink: {
    color: theme.palette.primary.main,
    fontWeight: 500,
    textDecoration: 'none',
  },
  post: {
    background: theme.palette.background.paper,
  },
  authorBar: { paddingTop: theme.spacing(2.5) },
  avatar: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    marginRight: theme.spacing(1),
    borderRadius: 2,
  },
  author: {
    color: theme.palette.primary.light,
    marginRight: theme.spacing(1),
    fontWeight: 500,
    fontSize: 14,
    textDecoration: 'none',
  },
  ts: {
    color: theme.palette.text.hint,
    fontWeight: 500,
    fontSize: 14,
  },
  text: {
    paddingBottom: theme.spacing(2),
    lineHeight: '1.56',
    wordBreak: 'break-word',
    hyphens: 'auto',
    color: theme.palette.type === 'dark' ? '#eee' : theme.palette.text.primary,
  },
  title: {
    fontWeight: 800,
    fontFamily: 'Google Sans',
    fontSize: 28,
    lineHeight: '34px',
    wordBreak: 'break-word',
    hyphens: 'auto',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  commentsButton: {
    marginTop: theme.spacing(2),
  },
}))

const Post = () => {
  const [post, setPost] = useState<IPost>()
  const [fetchError, _setError] = useState<string>()
  const { id } = useParams<{ id: string }>()
  const classes = useStyles()
  const contents = post ? (
    <>
      <Container className={classes.hubs}>
        {post.hubs.map((hub, i) => (
          <Typography key={i} variant="caption">
            <Link className={classes.hubLink} to={'/hub/' + hub.alias}>
              {hub.titleHtml}
            </Link>
            {post.hubs.length - 1 !== i && ', '}
          </Typography>
        ))}
      </Container>
      <Divider />
      <Container className={classes.post}>
        <Grid
          className={classes.authorBar}
          container
          direction="row"
          alignItems="center"
        >
          <UserAvatar
            login={post.author.login}
            src={post.author.avatar}
            className={classes.avatar}
          />
          <Typography
            component={Link}
            to={'/user/' + post.author.login}
            className={classes.author}
          >
            {post.author.login}
          </Typography>
          <Typography className={classes.ts}>
            {moment(post.timePublished).fromNow()}
          </Typography>
        </Grid>
        <Typography className={classes.title}>{post.titleHtml}</Typography>

        {/* Article text */}
        <FormattedText className={classes.text}>
          {post.textHtml}
        </FormattedText>
      </Container>

      {/* Bottom bar with some article info */}
      <BottomBar post={post} />
    </>
  ) : (
    <PostViewSkeleton />
  )

  const setError = (e: string) => {
    setPost(null)
    return _setError(e)
  }

  useEffect(() => {
    const get = async () => {
      // Reset error state
      setError(null)
      window.scrollTo(0, 0)

      try {
        setPost(await getPost(id))
      } catch (e) {
        if (e.statusCode === 404) return setError('Статья не найдена')
        else return setError(e.message)
      }
    }
    get()
  }, [id])

  if (post) document.title = post.titleHtml
  if (fetchError) return <ErrorComponent message={fetchError} />

  return (
    <div className={classes.root}>
      {contents}

      {/* Button to Comments page */}
      {post && <CommentsButton className={classes.commentsButton} id={id} count={post.statistics.commentsCount} />}

      {/* Similar */}
      <SimilarPosts id={id} />

      {/* Top day */}
      <TopDayPosts />
    </div>
  )
}

export default React.memo(Post)
