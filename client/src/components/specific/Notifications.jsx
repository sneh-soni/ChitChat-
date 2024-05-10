import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem divider>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar alt={name} src={avatar} />
        <Stack>
          <Typography
            variant="body1"
            sx={{
              flexGrow: 1,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </Typography>
          <Typography variant="caption" fontSize={"0.6rem"} color={"gray"}>
            sent you a request
          </Typography>
        </Stack>
        <Stack
          paddingX={"1rem"}
          direction={{ xs: "column", sm: "row" }}
          spacing={"0.5rem"}
        >
          <Button
            color="error"
            variant="outlined"
            size="small"
            onClick={() => handler({ _id, accept: false })}
          >
            Reject
          </Button>
          <Button
            color="warning"
            variant="contained"
            size="small"
            onClick={() => handler({ _id, accept: true })}
          >
            Accept
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

const Notifications = () => {
  const dispatch = useDispatch();
  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const { isNotification } = useSelector((store) => store.misc);
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  useErrors([{ error, isError }]);

  const closeHandler = () => dispatch(setIsNotification(false));

  const friendRequestHandler = async ({ _id, accept }) => {
    await acceptRequest(`${accept ? "Accepting.." : "Rejecting.."}`, {
      requestId: _id,
      accept,
    });
    dispatch(setIsNotification(false));
  };

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack
        width={{ xs: "18rem", sm: "25rem" }}
        padding={{ xs: "0.5rem", sm: "1rem" }}
      >
        <DialogTitle>Notifications</DialogTitle>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {data?.allRequests.length > 0 ? (
              data?.allRequests?.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  sender={notification.sender}
                  _id={notification._id}
                  handler={friendRequestHandler}
                />
              ))
            ) : (
              <Typography textAlign={"center"}>No Notifications</Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
};

export default Notifications;
